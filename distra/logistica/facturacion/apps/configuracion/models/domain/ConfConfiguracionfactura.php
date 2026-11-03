<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class ConfConfiguracionfactura extends BaseConfConfiguracionfactura
{

    public function setUp()
    {
        $this->hasMany(
            'ConfRecargo',
            array(
            'local' => 'idestructuracomun',
            'foreign' => 'idestructuracomun'
            )
        );
        parent::setUp();
    }

    /**
     * Funcion que permite guardar la configuracion de Facturacion
     * para determinada estructura
     *
     * @param array $params Arreglo con las configuraciones
     *                      de una estructura determinada
     *
     * @return NULL
     */
    public function addNewConfiguration($params)
    {
        $objConffactura = Doctrine::getTable('ConfConfiguracionfactura')
            ->find($params['idestructuracomun']);
        if (empty($objConffactura)) {
            $objConffactura = new ConfConfiguracionfactura();
            $idpadrematriz = $params['idestructuracomun'];//cambiar esto por la entidad de la que se hereda la matriz si es el caso
        } else {
            $idpadrematriz = ($objConffactura->idpadrematriz) ? $objConffactura->idpadrematriz : $params['idestructuracomun'];
        }
        $recargo = new ConfRecargo();
        $params['cobrorecargo'] == 1 ?
                $recargo->addRecargos($params) :
                $recargo->deleteAllRecargos($params);
        if (is_numeric($params['mediaproductos'])){
            $mediaproducto = $params['mediaproductos'];
        }
        if (is_numeric($params['mediaservicios'])){
            $mediaservicio = $params['mediaservicios'];
        }
        if (is_numeric($params['formula'])){
            $formula = $params['formula'];
        }
        if (is_numeric($params['tipopreciocentral'])){
            $tipopreciocentral = $params['tipopreciocentral'];
        }
        unset($params['mediaproductos']);
        unset($params['mediaservicios']);
        unset($params['formula']);
        unset($params['tipopreciocentral']);
        $objConffactura->synchronizeWithArray($params);
        if ($params['idcuenta']) {
            Doctrine_Query::create()
                ->delete()
                ->from('ConfCuentafactura')
                ->where(
                    'idestructuracomun = ?',
                    array($params['idestructuracomun'])
                )
                ->execute();
            $cuentas = json_decode($params['idcuenta']);
            $coll = new Doctrine_Collection('ConfCuentafactura');
            foreach ($cuentas as $cu) {
                $existe = Doctrine::getTable('ConfCuentafactura')->find(array($params['idestructuracomun'], $cu->idcuenta));
                if (!$existe) {
                    $obj = new ConfCuentafactura();
                    $obj->idestructuracomun = $params['idestructuracomun'];
                    $obj->idcuenta = $cu->idcuenta;
                    $coll->add($obj);
                }
            }
        }
        $objConffactura->save();
        $coll->save();
        $set = "set mediaproductos = ".(isset($mediaproducto)? $mediaproducto : 'null').
            ', mediaservicios = '.(isset($mediaservicio)? $mediaservicio : 'null').
            ', tipopreciocentral = '.(isset($tipopreciocentral)? $tipopreciocentral : 'null').
            ', formula = '.(isset($formula)? $formula : 'null');
        $sql = "update mod_logfacturacion.conf_configuracionfactura {$set} where idpadrematriz = {$idpadrematriz}";
        Doctrine_Manager::connection()->execute($sql);
    }

    /**
     * Funcion que permite cargar la configuracion de Facturacion
     *
     * @param mixed $idestructuracomun El identificador de la estructura
     *
     * @return array Retorna la configuracion segun la estructura
     */
    public function loadConfiguration($idestructuracomun)
    {
        $sql = "select c.*, array(SELECT idcuenta FROM mod_logfacturacion.conf_cuentafactura WHERE idestructuracomun = {$idestructuracomun}) AS idcuenta
                from mod_logfacturacion.conf_configuracionfactura c where c.idestructuracomun = {$idestructuracomun}";
        $aux = LogisticaDoctrineHelper::__init()->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $aux;
        /*return Doctrine_Query::create()
                ->select("*, ARRAY(SELECT idcuenta FROM conf_cuentafactura WHERE idestructuracomun = {$idestructuracomun}) AS idcuenta")
                ->from('ConfConfiguracionfactura c')->where("c.idestructuracomun = ?", array($idestructuracomun))
                ->fetchArray();*/
    }

    /**
     * Funcion que permite cargar el listado
     * segun el tipo de precio seleccionado para los productos
     *
     * @param array $params Arreglo con los datos necesarios
     *                      para obtener la matriz
     *
     * @return array Retorna la matriz y el total de la matriz
     */
    public function getAllProducts($params)
    {
        //$confGeneral = ServiciosConfiguracionGeneralHelper::__init();
        $maestroProducto = new MaestroProductoModel();
        ///  $query = Doctrine_Query::create();$query = 
        $query = $maestroProducto->getQueryIndicador("i");
        $query = self::getFiltrerByProducts($query, $params);
        $query->addSelect('i.tipo, ntz.denominacion as naturaleza');
        $query->innerJoin('i.NomIndicadorhoja ih');
        $query->innerJoin('i.NomNaturaleza ntz');
        if ($params['servicio'] === true || $params['servicio'] === 'true') {
            $query->addSelect(
                "(SELECT cc.denominacion FROM NomClasificacioncontablelog cc ".
                       "WHERE cc.facturacion = 1 AND cc.codigo = ih.codigoauxiliar) as clasificacion"
            );
            $query->addWhere('i.tipo =?', array(2));
        } else {
            $query->addWhere('i.tipo =?', array(1));
        }
        ServiciosConfiguracionGeneralHelper::__init()->getQueryJoinUnidadMedida(
            $query, 'i', 'umedida', 'umedida.abreviaturaunidadmedida as umedida', 'leftJoin'
        );
        return array(
            'cantidad' => $query->count(),
            'matriz' => $query->fetchArray()
        );
    }

    /**
     * Funcion que permite filtrar el listado
     * segun el tipo de precio seleccionado para los productos
     *
     * @param object $query  Objeto de doctrine
     * @param array  $params Arreglo con los datos necesarios
     *                       para obtener la matriz
     *
     * @return array Retorna la matriz y el total de la matriz
     */
    public function getFiltrerByProducts($query, $params)
    {
        if ($params['limit']) {
            $query->offset($params['start'])->limit($params['limit']);
        }
        if ($params['criterio']) {
            $query->addWhere(
                "lower(i.codigo) ilike lower('%{$params['criterio']}%') "
                . "or lower(i.denominacion) ilike "
                . "lower('%{$params['criterio']}%') "
                . "or lower(i.numeropieza) ilike "
                . "lower('%{$params['criterio']}%')"
            );
        }
        if ($params['idnaturaleza']) {
            $query->addWhere(
                'i.idnaturaleza = ?', array($params['idnaturaleza'])
            );
        }
        $query = self::addFiltrerByProducts($query, $params);
        return $query;
    }

    /**
     * Funcion que permite filtrar el listado
     * segun el tipo de precio seleccionado para los productos
     *
     * @param object $query  Objeto de doctrine
     * @param array  $params Arreglo con los datos necesarios
     *                       para obtener la matriz
     *
     * @return array Retorna el filtro de matriz
     */
    public function addFiltrerByProducts($query, $params)
    {
        if ($params['idpadre']) {
            $query->addWhere("i.idpadre = ?", array($params['idpadre']));
        }
        if ($params['idindicador']) {
            $query->addWhere(
                "i.idindicador = ?", array($params['idindicador'])
            );
        }
        if ($params['naturaleza']) {
            $query->addWhere(
                "i.idnaturaleza = ?", array($params['naturaleza'])
            );
        }
        if ($params['texto']) {
            if ($params['texto'] == 1)
                $query->addWhere(
                    "(SELECT COUNT(dmp.idmatrizprecio) FROM DatMatrizprecio dmp 
                    INNER JOIN dmp.DatMatrizpreciodualmonetaria dmdm WHERE dmp.idtipoprecio = {$params['idtipoprecio']}
                     AND dmp.idindicador = i.idindicador AND dmp.idestructuracomun = {$params['idestructuracomun']}) > 0");
            else
                $query->addWhere(
                    "(SELECT COUNT(dmp.idmatrizprecio) FROM DatMatrizprecio dmp 
                    INNER JOIN dmp.DatMatrizpreciodualmonetaria dmdm WHERE dmp.idtipoprecio = {$params['idtipoprecio']}
                     AND dmp.idindicador = i.idindicador AND dmp.idestructuracomun = {$params['idestructuracomun']}) = 0");
        }
        if ($params['clasificacion']) {
            $query->addWhere(
                "ih.codigoauxiliar = (SELECT cc1.codigo FROM NomClasificacioncontablelog cc1 WHERE cc1.idclasificacioncontable = {$params['clasificacion']})", array()
            );
        }
        if ($params['idgruposubgrupo']) {
            $query->addWhere(
                'ih.idgruposubgrupo = ?', array($params['idgruposubgrupo'])
            );
        }
        if ($params['marcamodelo']) {
            $query->addWhere(
                "lower(i.marcamodelo) ilike "
                . "lower('%{$params['marcamodelo']}%')"
            );
        }
        return $query;
    }

    /**
     * Funcion que permite obtener los distintos tipos de categorias de precio
     *
     * @param array $params Arreglo con los parametros necesarios
     *                      para obtener las categorias de precios definidad
     *
     * @return array Retorna las categorias de precio existentes en
     * la estructura y la cantidad total de estas
     */
    public function getCuentasByDesglosePrecio($params)
    {
        $objNomenclador = new NomencladoresLogService();
        $objDoctrine = $objNomenclador->getQueryCategoriaPrecio();
        $objDoctrine->addSelect('m.aplicartodos, m.valor');
        $query = self::getFiltrerByDesglose($params, $objDoctrine);
        if ($params['columns']) {
            return $query->fetchArray();
        }
        return [
            'cantidad' => $query->count(),
            'datos' => $query->fetchArray()
        ];
    }

    public function getTiposPrecio($params)
    {
        $objNomenclador = new NomencladoresLogService();
        $objDoctrine = $objNomenclador->devolverTipoPrecio($params, true);
        if ($params['grid'] == "izq" && is_array($params['result'])) {
            $objDoctrine['query']->andWhereNotIn(
                "m.idtipoprecio", $params['result']
            );
        }
        if ($params['grid'] == 'der' && is_array($params['result'])) {
            $objDoctrine['query']->andWhereIn("m.idtipoprecio", $params['result']);
        }
        return array('datos' => $objDoctrine['query']->fetchArray());
    }

    /**
     * Funcion filtro que permite obtener
     * los distintos tipos de categorias de precio
     *
     * @param array  $params Arreglo con los parametros necesarios
     *                       para obtener las categorias de precios definidad
     * @param object $query  Objeto de doctrine
     *
     * @return object Retorna el objeto de doctrine
     */
    public function getFiltrerByDesglose($params, $query)
    {
        /*$query->addWhere(
            "dcpe.idestructuracomun = ?", array($params['idestructuracomun'])
        );*/
        if ($params['grid'] == "izq" && is_array($params['result'])) {
            $query->whereNotIn(
                "m.idcategoriaprecio", $params['result']
            );
            $query->addWhere("m.estado = ? ", '1');
        }
        if ($params['grid'] == 'der' && is_array($params['result'])) {
            $query->whereIn("m.idcategoriaprecio", $params['result']);
            //$query->addWhere("m.estado = ? ", '1');
        }
        return self::addFiltrerByDesglose($params, $query);
    }

    /**
     * Funcion filtro que permite obtener
     * los distintos tipos de categorias de precio
     *
     * @param array  $params Arreglo con los parametros necesarios
     *                       para obtener las categorias de precios definidad
     * @param object $query  Objeto de doctrine
     *
     * @return object Retorna el objeto de doctrine
     */
    public function addFiltrerByDesglose($params, $query)
    {
        if ($params['grid'] == 'der') {
            $query->leftJoin("m.DatCuentadesgloceprecio dcdp")
                ->addWhere('dcdp.idtipoprecio = ?', array($params['tipoP']))
                ->addSelect(
                    'dcdp.idcuentadesgloseprecio '
                    . 'as idcuentadesgloseprecio,'
                    . 'dcdp.idcuenta as idcuenta'
            );
        }
        if ($params['desgloseprecio']) {
            $query->leftJoin("m.DatCuentadesgloceprecio dcdp")
                ->addWhere(
                    "dcdp.idcuentadesgloseprecio = ?", array($params['desgloseprecio'])
            );
        }
        if ($params['conformarprecio']) {
            $query->addWhere("m.conformaprecio = ?", array(1));
        }
        return $query;
    }

    /**
     * Funcion que permite obtener las categrias de la matriz
     *
     * @param array $params Arreglo con los parametros necesarios
     *                      para obtener las categorias
     *
     * @return array Retorna un array con las categorias
     */
    public function getCategoria($params)
    {
        //$confGeneral = ServiciosConfiguracionGeneralHelper::__init();
        $maestroProducto = new MaestroProductoModel();
        //  $query = Doctrine_Query::create();

        $query = $maestroProducto->getQueryIndicador("i");
        $query = self::filtrerByCategoria($query, $params);
        /* $queryindicador = $confGeneral->dameQueryRootIndicador(
          $queryfiltrer, 'i', '', 'N'
          ); */
        return $query->fetchArray();
    }

    /**
     * Funcion que permite filtrar segun los parametros definidos
     *
     * @param object $query Objeto de Doctrine
     * @param array  $params
     *
     * @return object Retorna un objeto de Doctrine
     */
    public function filtrerByCategoria($query, $params)
    {
        if ($params['nivel']) {
            $query->addWhere('i.nivel = ?', array($params['nivel']));
        }
        if ($params['idpadre']) {
            $query->addWhere('i.idpadre = ?', array($params['idpadre']))
                ->addWhere('i.idpadre <> i.idindicador');
        }
        return $query;
    }

}
