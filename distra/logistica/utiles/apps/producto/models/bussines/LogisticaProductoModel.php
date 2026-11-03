<?php

/**
 * Clase que se encarga de la gestion de las funciones sobre los productos
 *
 * @package       Logistica
 * @subpackage    Utiles
 * @author        Kenier Cumba Bueno
 * @copyright (c) 2014, XETID
 * @version       1.0
 */
class LogisticaProductoModel extends BaseModel
{

    private $movimientoModel, $maestroProductos, $configuracionHelper, $esFarmacia;

    /**
     * Clase que se encarga de la gestion de las funciones sobre los productos
     */
    public function __construct()
    {
        parent::__construct();
        $this->movimientoModel = new LogisticaMovimientoModel;
        $this->movimientoModel->setProductoModel($this);
        $this->maestroProductos = new MaestroProductoModel;
        $this->configuracionHelper = ServiciosConfiguracionGeneralHelper::__init();
        $this->esFarmacia = (new VariablesGlobalesModel())->obtenerValor('farmacia');
        $this->initRelations();
    }

    public function cargaInicial()
    {
        $datos = Doctrine_Manager::connection()->fetchAll('SELECT * FROM mod_logmetadata.dat_nomenclador');
        return array('datos' => $datos);
    }

    public function getMaestroProducto()
    {
        return $this->maestroProductos;
    }

    /**
     * Funcion que adiciona un arreglo de productos a una estructura, que pue ser un almacen o una estructura interna
     *
     * @param array $arrayIdprod Arreglo con los datos de los producto a adicionar
     *
     * @return boolean
     */
    public function adicionarProductoEstructuras($arrayIdprod)
    {
        $collectionProductos = new Doctrine_Collection('DatProductoLogistica');
        foreach ($arrayIdprod as $datosProducto) {
            if (empty($datosProducto['idclasificacioncontable'])) {
                unset($datosProducto['idclasificacioncontable']);
            }
            //unset($datosProducto['DatProductoLogistica']);
            $ind = $this->maestroProductos->devolverIndicadorById($datosProducto['idindicador']);
            if (!$datosProducto['preciocontable']) {
                $datosProducto['preciocontable'] = $ind['precio'];
            }
            $datosProducto['entrada'] = 1;
            if (!$this->validarExistenciaProdCantegDep(array('idestructura' => $datosProducto['idestructura'],
                    'data' => json_encode($datosProducto)))) {
                throw new LogisticaException('LOG_LB_Prod_001', false, false,
                "<b>C&oacute;digo - Denominaci&oacute;n:</b> {$ind['text']}");
            }
            $collectionProductos->add($this->adicionarProducto($datosProducto));
        }
        if ($collectionProductos->count()) {
            $collectionProductos->save();
        }
        return true;
    }

    /**
     * Funcion para ejecutar una consulta sobre la tabla DatProductoLogistica y devuelve el objeto query
     *
     * @param string $as Alias con que instancia la clase DatProductoLogistica
     *
     * @return Doctrine_Query El query
     */
    public function getQueryProducto($as = 'p', $select = true)
    {
        $dqlResult = new Doctrine_Query();
        $dqlResult->from("DatProductoLogistica {$as}");
        if ($select) {
            $dqlResult->select(
                " {$as}.idproducto, {$as}.idindicador as idindicador, {$as}.idestructura as idestructura,"
                . "{$as}.idumedida as idumedidacrc,{$as}.idcategoria as idcategoria, {$as}.cronologia as cronologia,"
                . "round(coalesce({$as}.cantidad,0),6) as existencia, round({$as}.precio,6) as precio,round({$as}.precio,6) as preciocontable,"
                . "round({$as}.minimo,6) as minimo,round({$as}.maximo,6) as maximo,"
                . "round({$as}.precioalternativo,6) as precioalternativo,{$as}.idestructuracomun as  identidad,"
                . "round({$as}.importealternativo,2) as importealternativo,"
                . "round(({$as}.cantidad * {$as}.precio),2) as importecalculado,"
                . "round(({$as}.cantidad * {$as}.precioalternativo),2) as importealtcalculado,"
                . "{$as}.idcategoria as  idcategoria, round({$as}.importe,2) as importetotal,"
                . "{$as}.fechavencimiento as  fechavencimiento, {$as}.fechafabricacion as  fechafabricacion, "
                . "{$as}.propiedad, {$as}.esbaja"
            );
        }
        return $dqlResult;
    }

    /**
     * Funcion que adiciona un left join sobre la tabla DatProductoLogistica para concatenar
     * consultas en tiempo de codigo
     *
     * @param Doctrine_Query $query        Objeto query donde se ejecuta la consulta
     * @param string         $aliasExterno Alias de la clase que contiene la relacion con DatProductoLogistica
     * @param string         $as           Alias con que se instancia la clase DatProductoLogistica
     *
     * @return Doctrine_Query El objeto query
     */
    public function getJoinDatProducto(Doctrine_Query $query, $aliasExterno, $as = 'p')
    {
        return $query->leftJoin("{$aliasExterno}.DatProductoLogistica {$as}")->addSelect(
                " {$as}.idindicador as idindicador, {$as}.idproducto as idproducto, {$as}.idproducto,"
                . "{$as}.idestructura as idestructura, {$as}.idcategoria as idcategoria, "
                . "{$as}.idumedida as idumedidacrc, round({$as}.cantidad,6) as existencia,"
                . "{$as}.cronologia as cronologia, {$as}.minimo as minimo, {$as}.maximo as maximo, "
                . "{$as}.propiedad as propiedad"
        );
    }

    /**
     * Funcion que aplica filtros a la consulta sobre la clase DatProductoLogistica
     *
     * @param Doctrine_Query $dql    Objeto query donde se ejecuta la consilta
     * @param string         $as     Alias de la clase que contiene la relacion con DatProductoLogistica
     * @param array          $filter Arreglo que contiene los valores de con los que se filtra la consulta
     */
    public function addFiltersQueryDatProducto(Doctrine_Query $dql, $as = 'p', $filter = array(), $datosGen = true)
    {
        if ($filter['idestructura']) {
            if (is_string($filter['idestructura'])) {
                $filter['idestructura'] = json_decode($filter['idestructura']);
            }
            $filter['idestructura'] = is_array($filter['idestructura']) ? $filter['idestructura'] :
                array($filter['idestructura']);
            $dql->andWhereIn("{$as}.idestructura", $filter['idestructura']);
        }
        if ($filter['identidad']) {
            $filter['identidad'] = json_decode($filter['identidad']);
            if (!is_array($filter['identidad'])) {
                $filter['identidad'] = array($filter['identidad']);
            }
            $dql->andWhereIn("{$as}.idestructuracomun", $filter['identidad']);
        }
        if ($filter['idindicadorprod']) {
            $dql->andWhereIn("{$as}.idindicador", json_decode($filter['idindicadorprod']));
        }
        if ($filter['idumedida']) {
            $dql->andWhere("{$as}.idumedida = ?", array($filter['idumedida']));
        }
        if ($filter['idcategoria']) {
            $dql->andWhere("{$as}.idcategoria = ?", array($filter['idcategoria']));
        }
        if ($filter['idproducto']) {
            $dql->andWhere("{$as}.idproducto = ?", array($filter['idproducto']));
        }
        if ($filter['idseleccionados']) {
            $dql->andWhereNotIn("{$as}.idproducto", json_decode($filter['idseleccionados']));
        }
        if ($filter['idclasificacioncontable']) {
            $dql->andWhere("{$as}.idclasificacioncontable =?", array($filter['idclasificacioncontable']));
        }
        if ($filter['idarea']) {
            $ubicacion = new UbicacionModel();
            $ubicacion->addDqlCantidadPorArea($dql, $filter);
        }
        if ($datosGen) {
            $this->addQueryIndicadorFilers($dql, $filter, 'i', $as);
        }
        $this->filtrosCantidades($dql, $as, $filter);
    }

    private function filtrosCantidades(Doctrine_Query $dql, $as = 'p', $filter = array())
    {
        if ($filter['existencia']) {
            $dql->andWhere("{$as}.cantidad = ?", array($filter['existencia']));
        }
        if ($filter['conexistencia'] && !$filter['criterio']) {
            $dql->andWhere("{$as}.cantidad > 0");
        }
        if ($filter['condisponible']) {
            $dql->andWhere(
                "({$as}.cantidad - (coalesce((SELECT sum(cantidad) FROM DatCantidadesComprometidas "
                . "WHERE idproducto = {$as}.idproducto AND estado = 1), 0))) > 0"
            );
        }
        if ($filter['cantdias'] || ($filter['desde'] && $filter['hasta'])) {

            /* $objLentoMov = new MovimientoLentoModel();
              $valorProd = $objLentoMov->cantProductosFechas($filter); */
            $valorProd = $this->cantProductosFechas($filter);
            $idsproducto = $this->objectHelper->extractValueFromArrayColumn($valorProd['datos'], 'idproducto');
            $dql->andWhereIn("{$as}.idproducto", $idsproducto);
        }
        if ($filter['asentado'] && $filter['asentado'] != -1) {
            $dql->andWhere("{$as}.cronologia > 0");
        }
    }

    /*     * * By Tony porque daba un error con lento movimiento en diciembre */

    public function cantProductosFechas($params)
    {
        if ($params['tony']) {
            $desde = $params['desde'];
            $hasta = ($params['hasta']) ? $params['hasta'] : date('Y-m-d');
            $sql = "select p.idproducto from mod_loginventario.f_productoslentomovimiento(
            {$params['idestructura']},'{$desde}','{$hasta}',{$params['start']},{$params['limit']}
            ) p";
            $conn = Zend_Registry::get('conexion');
            $resp = $conn->fetchAll($sql);
            return array('datos' => $resp, 'cantidad' => $resp['cant']);
        } elseif ($params['cantdias']) {
            $fechaActual = date('Y-m-d');
            $nuevafecha = date('Y-m-d', strtotime("-{$params['cantdias']} day"));
            $sql = "select p.idproducto from mod_loginventario.f_productoslentomovimiento(
            {$params['idestructura']},'{$nuevafecha}','{$fechaActual}',{$params['start']},{$params['limit']}
            ) p";
            $conn = Zend_Registry::get('conexion');
            $resp = $conn->fetchAll($sql);
            return array('datos' => $resp, 'cantidad' => $resp['cant']);
        }
    }

    /**
     * Funcion que devuelve una instancia de la clase DatProductoLogistica con los datos pasados por parametros
     * @params $datos Arreglo que contiene los datos del producto
     *
     * @return DatProductoLogistica Nueva de la instancia
     */
    public function adicionarProducto($datos)
    {
        /* $datosumedida = $this->configuracionHelper
          ->obtenerFactorConversionRespectoIndicador($datos['idindicador'],$datos['idumedia']);
         * este metodo no se ha hecho
         */
        if(empty($datos['maximo'])){
            unset($datos['maximo']);
        }
        if(empty($datos['minimo'])){
            unset($datos['minimo']);
        }
        $producto = new DatProductoLogistica();
        if ($datos['idproducto']) {
            $producto->assignIdentifier($datos['idproducto']);
        }
        if ($datos['idunidadmedida']) {
            $datos['idumedida'] = $datos['idunidadmedida'];
        }
        $producto->synchronizeWithArray($datos);
        $datos['signo'] = LogisticaMovimientoModel::SIGNO_MOV_SUMA;
        if (!$datos['idproducto']) {
            $producto->cantidad = 0;
            $producto->disponible = 0;
            $producto->precio = 0;
            $producto->importe = 0;
            $producto->precioalternativo = 0;
            $producto->importealternativo = 0;
            $producto->cronologia = 0;
        }
        $producto->save();
        if($datos['numero']){
            $datos['idproducto'] = $producto->idproducto;
            $datos['idfabricante'] = null;
            $lote = new DatLote();
            if ($datos['idlote']) {
                $lote->assignIdentifier($datos['idlote']);
            }
            $lote->synchronizeWithArray($datos);
            $lote->save();
        }
        if ($datos['iddocumento']) {
            $datos['idproducto'] = $producto->idproducto;
            $movimientoProducto = $this->movimientoModel->adicionarMovimiento($datos);
            if (!$movimientoProducto->idmovimiento) {
                $producto->DatMovimientos->add($movimientoProducto);
            }
        }
        return $producto;
    }

    /**
     * Metodo para cargar los productos
     * @param type $params
     */
    public function cargarProductos($params = array(), $dql = false, $decorador = null)
    {
        $nomenclador = new NomencladoresLogService();
        $query = $this->getQueryProducto('p');
        if ($params['entrada']) {
            $desactivados = $this->doctrineHelper->getConnection()->execute(
                "SELECT idproducto FROM mod_logistica.dat_productoinactivo "
            )->fetchAll(PDO::FETCH_COLUMN);
            if (count($desactivados)) {
                $query->andWhereNotIn('p.idproducto', $desactivados);
            }
        }
        if ($params['idarea']) {
            $ubicacion = new UtilesubicacionService();
            $params['aliasp'] = 'p';
            $ubicacion->innerJoinDatAreaProducto($query, $params);
        }
        $nomenclador->innerJoinNomCategoria($query, 'p', 'nc');
        if (class_exists('NomencladoresLogService')) {
            $nomenclador = new NomencladoresLogService();
            $nomenclador->getJoinClasificacionCont($query, 'p');
        }
        if (!$params['baja']) {
            $query->addWhere('p.esbaja = 0');
        }else{
			$query->addWhere('p.esbaja <> 0');
		}
        $this->maestroProductos->addQueryNomIndicador($query, 'p', ' i', 'ih');
        $this->maestroProductos->addQueryJoinMarcaModelo($query, 'ih', 'nmar', 'nm', true, true, 'i');
        $query->addSelect(
            'i.idindicador,(p.cantidad - coalesce((SELECT sum(_cc.cantidad) FROM DatCantidadesComprometidas _cc '
            . 'WHERE _cc.idproducto = p.idproducto AND _cc.estado = 1), 0)) AS disponible, '
            . '(SELECT _d.fechacontable FROM DatDocumento _d WHERE _d.cronologia = p.cronologia '
            . 'order by _d.cronologia desc limit 1) as fechaultimomov, round(p.precio,6) as precio'
        );
        $this->configuracionHelper->getQueryJoinUnidadMedida(
            $query, 'p', 'um', 'um.abreviaturaunidadmedida as umedida,um.decimales as decimales', 'leftJoin'
        );
        $this->configuracionHelper->innerJoinNomNaturaleza($query, 'i', 'nat', true);
        $query->addSelect('nat.denominacion as naturaleza');

        $this->addFiltersQueryDatProducto($query, 'p', $params);
        $query->addSelect(
            '(case when i.numeropieza is null or length(i.numeropieza) = 0 then i.codigo else i.numeropieza end) as codigo'
        );
        $this->addFiltroDocumentos($query, 'p', $params);
        $params['grid'] = true;
        /*$this->maestroProductos->addFiltersQueryIndicador($query, 'i', $params);
        $this->maestroProductos->addFiltersQueryIndicadorHoja($query, $params, 'ih');*/
        if (!is_null($decorador) && is_array($decorador)) {
            $this->objectHelper->decorate($query, $decorador['class'], $decorador['method'], $decorador['params']);
        }
        //echo ($this->_esFarmacia == 1);die;
        if($this->esFarmacia == 1){
            $query->addSelect('p.numerolote as numerolote, p.fechavencelote as fechavencelote');
            $query->orderBy("nat.denominacion,i.denominacion")->addOrderBy('p.fechavencelote ASC');
        }else{
            $query->orderBy("p.idestructura")->addOrderBy('i.codigo ASC');
        }
        if ($dql) {
            return $query;
        }
        return $this->concatenarDeposito(
                array(
                    'cantidad' => $query->count(),
                    'datos' => $this->maestroProductos->setLastLevel(
                        $this->doctrineHelper->addQueryLimits($query, $params)
                        ->fetchArray()
                    )
                )
        );
    }

    public function concatenarDeposito($params)
    {
        $cacheDepositos = array();
        $cacheEntidad = array();
        $paisArray = array();
        $clasificacionArray = array();
        foreach ($params['datos'] as &$value) {
            if (!$cacheDepositos[$value['idestructura']]) {
                $depositos = $this->estructuraHelper->getAreasPorId($value['idestructura']);
                $cacheDepositos[$value['idestructura']] = $depositos[0]['denominacion'];
            }
            if ($value['identidad'] && !$cacheEntidad[$value['identidad']]) {
                $entidad= $this->estructuraHelper->getEstructura($value['identidad']);
                $cacheEntidad[$value['identidad']] = $entidad[0]->denominacion;
            }
            if (!$paisArray[$value['idpais']]) {
                $paisArray[$value['idpais']] = $this->configuracionHelper->obtenerPaisXID($value['idpais']);
            }
            if (!is_null($value['cuenta']) && !$clasificacionArray[$value['cuenta']]) {
                $clasificacionArray[$value['cuenta']] = $this->contabilidadHelper->obtenerCuentaPorId($value['cuenta']);
            }
            if (!is_null($value['cuentaalt']) && !$clasificacionArray[$value['cuentaalt']]) {
                $clasificacionArray[$value['cuentaalt']] = $this->contabilidadHelper
                    ->obtenerCuentaPorId($value['cuentaalt']);
            }
            $value['deposito'] = $cacheEntidad[$value['identidad']].' - '.$cacheDepositos[$value['idestructura']];
            $value['nacionalidad'] = $paisArray[$value['idpais']]['siglas'];
            $value['cuentacontable'] = $clasificacionArray[$value['cuenta']]->text;
            $value['cuentaalternativa'] = $clasificacionArray[$value['cuentaalt']]->text;
        }
        return $params;
    }

    /**
     * Funcion que devuelve una instancia de la clase LogisticaMovimientoModel
     *
     * @return LogisticaMovimientoModel
     */
    public function getMovimientoModel()
    {
        return $this->movimientoModel;
    }

    /**
     * Funcion que adiciona un arreglo de productos a un documento, si los productos ya estan en el documento nos los
     * adiciona.
     * @param numeric $iddocumento Identificador del documento.
     * @param array $arrIdprod Arreglo con los datos de los productos a adicionar.
     * @param boolean $signo [Opcional] Signo del movimiento.
     * @param boolean $afectaDisponible [Opcional] Determina si afecta la cantidad disponible.
     * @return array Arreglo con los datos de los productos que fueron adicionados y los que no.
     */
    public function adicionarMovimientos($iddocumento, $arrIdprod, $signo = LogisticaMovimientoModel::SIGNO_NINGUNO,
        $afectaDisponible = false
    )
    {
        $cierre = DocumentoLogisticaModel::validarCuadreAlmacen(array('productos'=>$arrIdprod, 
        'iddocumento'=>$iddocumento));
        $flagAdicionar = $this->movimientoModel->adicionarMovimientos($iddocumento, $arrIdprod, $signo);
        if ($afectaDisponible && $signo == LogisticaMovimientoModel::SIGNO_MOV_RESTA) {
            foreach ($arrIdprod as $value) {
                if(isset($value['DatProductoLogistica']))
                  unset($value['DatProductoLogistica']);
                if (!is_array($value)) {
                    continue;
                }
                $this->checkDisponibleProducto($value['idproducto'], $value['cantidad'] * -1);
                $array['iddocumento'] = $iddocumento;
                $array['idproducto'] = $value['idproducto'];
                $array['cantidad'] = $value['cantidad'];
                $comprometida = new CantidadesComprometidasModel();
                $comprometida->insertarCantidadComprometida($array);
            }
        }
        return $flagAdicionar;
    }

    /**
     *
     * @param array $parametros
     * @param boolean $dql [Opcional]
     * @return array|Doctrine_Query
     */
    public function devolverMovimientos($parametros = array(), $dql = false)
    {
        $modelUbic = new UbicacionModel();
        $query = $this->movimientoModel->devolverMovimientos($parametros);
        $this->getJoinDatProducto($query, 'mov', 'p');
        $modelUbic->addSqlCantUbicaciones($query, 'p');
        $modelUbic->addSqlProductosUbicacion($query, 'p', 'ubic');
        if (class_exists('NomencladoresLogService')) {
            $nomenclador = new NomencladoresLogService();
            $nomenclador->innerJoinNomCategoria($query, 'p', 'nc');
            $nomenclador->getJoinClasificacionCont($query, 'mov');
        }
        $query->addSelect(
            '(p.cantidad - coalesce((SELECT sum(_cc.cantidad) FROM DatCantidadesComprometidas _cc '
            . 'WHERE _cc.idproducto = p.idproducto AND _cc.estado = 1), 0)) AS disponible'
        );
        $query->addSelect(
            "(case when mov.signo = '-' then round((p.importe - mov.importecontable),2) "
            . "else round((p.importe + mov.importecontable),2) end) as importefinal"
        );
        $query->addSelect('p.idindicador as idprod');
        $this->maestroProductos->addQueryNomIndicador($query, 'p', 'i', 'ih', true, 'ngs', 2, false);
        $this->configuracionHelper->innerJoinNomNaturaleza($query, 'i', 'nat', true);
        $query->addSelect('i.codigo as codigo,i.idnaturaleza,nat.denominacion as naturaleza');
        $query->addSelect('p.numerolote as numerolote, p.fechavencelote as fechavencelote');
        /*$query->addSelect(
            '(case when i.numeropieza is null or length(i.numeropieza) = 0 then i.codigo else i.numeropieza end) as codigo'
        );*/
        //$query->orderBy('i.numeropieza');
        if (class_exists('NomUnidadmedida')) {
            $this->configuracionHelper->getQueryJoinUnidadMedida(
                $query, 'p', 'um', 'um.abreviaturaunidadmedida as umedida,um.decimales as decimales', 'leftJoin'
            );
        }
        $this->addFiltroDocumentos($query, 'p', array('iddocumento' => $parametros['iddocexcluir']));
        $this->addFiltersQueryDatProducto($query, 'p', $parametros);
        //$query->orderBy("mov.idmovimiento",'ASC');
        $this->getOrderByProduct($query,'i','mov','nat');
        if($this->esFarmacia == 1){
            $query->orderBy("nat.denominacion,i.denominacion,p.fechavencelote",'ASC');
        }
        $a = $this->doctrineHelper->addQueryLimits($query, $parametros)->fetchArray();
        
        if ($dql) {
            return $query;
        }
        return $this->concatenarDeposito(
                array('cantidad' => $query->count(),
                    'datos' => $this->doctrineHelper->addQueryLimits($query, $parametros)->fetchArray()
        ));
    }

    /**
     * Metodo que devuelver los datos del clasificador de producto
     *
     * @param array $parametros
     *
     * @return array Arreglo que contiene los datos del nomenclador
     */
    public function devolverNomenclador($parametros = array())
    {
        /* $query = $this->configuracionHelper->dameQueryRootIndicador(null, 'i', 'ih', 'I');
          $this->addQueryIndicadorFilers($query, $parametros);
          $this->configuracionHelper->getQueryJoinUnidadMedida($query, 'i', 'umedida',
          'umedida.abreviaturaunidadmedida as umedida', 'leftJoin'
          );

        return array(
            'cantidad' => $query->count(),
            'datos' => $this->doctrineHelper->addQueryLimits($query, $parametros)->fetchArray()
        );*/
    }

    /**
     * Metodo que aplica los filtros del indicador a la busqueda del grid de productos
     *
     * @param Doctrine_Query $query
     * @param type           $params
     * @param type           $as
     */
    public function addQueryIndicadorFilers(Doctrine_Query $query, $params = array(), $as = 'i', $aliasProd = 'p')
    {
        if ($params['criterio']) {
            $criterio = $params['criterio'];
            $query->andWhere(
                "({$as}.denominacion ilike '%{$criterio}%' or {$as}.codigo like '%{$criterio}%') "
                . "or {$as}.numeropieza ilike '%{$criterio}%' or {$aliasProd}.numerolote ilike '%{$criterio}%'"
                );
        }
        if ($params['denominacion']) {
            $query->andWhere("{$as}.denominacion ilike '%{$params['denominacion']}%'");
        }
        if ($params['codigo']) {
            $query->andWhere("{$as}.codigo ilike '%{$params['codigo']}%'");
        }
        if ($params['idnaturaleza']) {
            $query->andWhere("{$as}.idnaturaleza = ?", array($params['idnaturaleza']));
        }
        if (is_array($params['idnaturalezaexcluir'])) {
            $query->andWhereNotIn("{$as}.idnaturaleza", $params['idnaturalezaexcluir']);
        }
        if ($params['idindicador']) {
            $params['idindicador'] = json_decode($params['idindicador']);
            $params['idindicador'] = is_array($params['idindicador']) ? $params['idindicador'] :
                array($params['idindicador']);
            $query->andWhereIn("{$as}.idindicador", $params['idindicador']);
        }
        if ($params['tipo']) {
            $query->andWhere("{$as}.tipo = ?", array($params['tipo']));
        }
        if ($params['idespecialidad']) {
            $query->andWhere("{$as}.idespecialidad = ?", array($params['idespecialidad']));
        }
        if ($params['codigoproveedor']) {
            $query->andWhere("{$as}.numeropieza ilike '%{$params['codigoproveedor']}%'");
        }

        if ($params['tipoproducto']) {
            $tipoproducto = is_array($params['tipoproducto']) ? $params['tipoproducto'] :
                array($params['tipoproducto']);
            $query->andWhereIn("ih.tipocontrol", $tipoproducto);
        }
        if ($params['idalternativo']) {
            $datos = LogisticaDoctrineHelper::__init()->query(
                "select n.codigoauxiliar FROM NomIndicadorhoja n WHERE n.idindicador = {$params['idalternativo']}"
            );
            $query->andWhere(
                "ih.codigoauxiliar = ? AND ih.idindicador <> ?",
                array($datos[0]['codigoauxiliar'], $params['idalternativo'])
            );
        }
        if($params['isuh'] && count($params['isuh']) > 0){
            
            $filtarr = array();
            foreach($params['isuh'] as $filt){
                if($filt == 0){
                    array_push($filtarr, "ih.isuh <> 1");
                } else {
                    array_push($filtarr, "ih.isuh = 1");
                }
            }
            if(count($filtarr) > 0){
                $query->andWhere(implode(' OR ', $filtarr));
            }
        }
//        $query->andWhere("ih.almacenado = ?", array(1));
    }

    /**
     * Metodo que elimina los movimientos de un documento, emplear cuando se eliminan productos seleccionados
     * o se elimina un documento completo
     *
     * @param Integer $iddocumento      Identificador del documento del que se van a eliminar los movimientos
     *                                  pasar en false si se vana a eliminar productos seleccionados.
     * Usar cuando se va a eliminar el documento
     * @param array   $arrIdMovimientos Arreglo que contiene los identificadores de los movimientos a eliminar
     *                                  pasar en flase si se elimina el documento
     * @param boolean $afectaDisponible Variable que controla si la modificacion del movimiento afecta la cantidad
     *                                  disponible del producto. TRUE para afectar el disponible FALSE si no.
     * Por defecto FALSE.
     * @param boolean $cancelar         Variable que controla si el movimiento se elimina fisico o solo se
     *                                  actualiza el estado. TRUE  para cambiar el estado FALSE para eliminar.
     *  Por defecto TRUE
     *
     * @return boolean
     */
    public function eliminarMovimientos(
    $iddocumento = false, $arrIdMovimientos = array(), $afectaDisponible = false, $cancelar = true)
    {      
        $cierre = DocumentoLogisticaModel::validarCuadreAlmacen(array('movimientos'=>$arrIdMovimientos));
        $resultEliminar = $this->movimientoModel->eliminarMovimientos(
            $iddocumento, $arrIdMovimientos, $afectaDisponible, $cancelar
        );
        if (is_array($resultEliminar)) {
            $cProductos = new Doctrine_Collection('DatProductoLogistica');
            foreach ($resultEliminar as $prod) {
                $record = new DatProductoLogistica;
                $record->assignIdentifier($prod['idproducto']);
                $comprometida = new CantidadesComprometidasModel();
                $comprometida->eliminarCantidadComprometida($prod['iddocumento'], $prod['idproducto']);
                $cProductos->add($record);
            }
            if ($cProductos->count()) {
                $cProductos->save();
            }
            $resultEliminar = true;
        }
        return $resultEliminar;
    }

    /**
     *
     * @param array $arrMovimientos
     * @param boolean $afectaDisponible [Opcional] Determina si afecta la cantidad disponible.
     * @return boolean
     */
    public function modificarMovimientos($arrMovimientos, $afectaDisponible = false)
    {
        $cProductos = new Doctrine_Collection('DatProductoLogistica');
        $cMovimientos = new Doctrine_Collection('DatMovimientos');
        $productos[] = array_map(function($el){
            return $el['idproducto'];
        }, $arrMovimientos);

        $cierre = DocumentoLogisticaModel::validarCuadreAlmacen(array('productos'=>$productos[0], 
            'idmovimiento'=>$arrMovimientos[0]['idmovimiento']));
        foreach ($arrMovimientos as $movimiento) {//validar cierre
            //print_r($arrMovimientos);die;
            if($arrMovimientos[0]['entrada']){
                $movimiento['entrada'] = $arrMovimientos[0]['entrada'];
            }            
            $resultModificar = $this->movimientoModel->modificarMovimiento($movimiento, (bool) $afectaDisponible);
            $cMovimientos->add($resultModificar['record']);
            if ($movimiento['minimo'] || $movimiento['maximo'] || $movimiento['idclasificacioncontable'] ||
                $movimiento['idcategoria'] || $movimiento['numerolote']) {
                $record = new DatProductoLogistica();
                $record->assignIdentifier($resultModificar['record']->idproducto);
                $arrayData = array(
                    'minimo' => $movimiento['minimo'], 'maximo' => $movimiento['maximo'],
                    'idclasificacioncontable' => $movimiento['idclasificacioncontable'],
                    'idcategoria' => $movimiento['idcategoria']
                );
                if (!$record->cronologia) {
                    $arrayData = array_merge($arrayData, array(
                            'numerolote'=>$movimiento['numerolote'],
                            'fechavencelote'=>$movimiento['fechavencelote']
                        )
                    );
                }
                $record->synchronizeWithArray(
                    $arrayData
                );
                $cProductos->add($record);
            }
        }
        if ($cMovimientos->count()) {
            $cMovimientos->save();
        }
        if ($cProductos->count()) {
            $cProductos->save();
        }
        return true;
    }

    /**
     * Metodo que chequea si la cantidad puede ser sumada algebraicamente al disponible del producto
     *
     * @param Integer $idProducto Identificador del producto
     * @param Integer $cantidad   Cantidad a verificar
     * @throws ZendExt_Exception Excepcion que se lanza si la disponibilidad se hace negativa
     */
    public function checkDisponibleProducto($idProducto, $cantidad)
    {
        $disponible = "(p.cantidad - coalesce((SELECT sum(cc.cantidad) FROM DatCantidadesComprometidas cc "
            . "WHERE cc.idproducto = {$idProducto} AND cc.estado = 1), 0))";
        $dql = "SELECT ({$disponible} + {$cantidad}) as saldo "
            . "FROM DatProductoLogistica p "
            . "WHERE p.idproducto = {$idProducto}";
        $cantidadP = $cantidad;
        $cantidad = $this->doctrineHelper->query($dql)->toArray();
        if ($cantidad[0]['saldo'] < 0 && $cantidadP != 0) {
            throw new ZendExt_Exception('LOG_LB_PROD_001');
        }
    }

    /**
     * Metodo para asentar los movimientos de un documento
     *
     * @param numeric $iddocumento Identificador del documento a aproabr
     * @param numeric $cronologia  Cronologia del documento
     * @param boolean $isEntrada   Variable que controla si se asienta el movimiento y se afecta la disponibilidad
     * TRUE si aumenta FALSE si no. Por defecto FALSE.
     * @param boolean $updateExistencia [Opcional] Variable que controla si se afecta la existenciaactual.
     * Por defecto TRUE.
     * @param boolean $invertirPrecio [Opcional] Por defecto FALSE.
     * @param boolean $importe [Opcional] Determina si se accede directamente al importe del movimiento
     * para el calculo del precio promedio. Por defecto FALSE.
     *
     * @return boolean
     */
    public function aprobarMovimientos(
    $iddocumento, $cronologia, $isEntrada = false, $updateExistencia = true, $invertirPrecio = false, $importe = false
    )
    {
        return $this->movimientoModel->aprobarMovimientos(
                $iddocumento, $cronologia, $isEntrada, $updateExistencia, $invertirPrecio, $importe
        );
    }

    /**
     *
     * @param type $idProducto
     * @param type $refObjet
     *
     * @return type
     */
    public function getDatosProducto($idProducto, & $refObjet = null)
    {
        $dql = "SELECT (p.precio) as precio, p.importe as importe, p.cantidad as existencia, "
            . "p.idumedida as idumedida, p.idindicador as idindicador, p.precioalternativo AS precioalternativo, "
            . "p.importealternativo AS importealternativo "
            . "FROM DatProductoLogistica p "
            . "WHERE p.idproducto = {$idProducto}";

        $arrayData = $this->doctrineHelper->query($dql)->toArray();
        if ($refObjet) {
            $this->objectHelper->synchronize($refObjet, $arrayData[0]);
        }
        return $arrayData[0];
    }

    /**
     * Metodo para vereificar si existe una apertura de un producto, con la misma categoria en un depostio
     *
     * @param type $parametros arreglo de valores(idestructura, idcategoaria,idindicador)
     *
     * @return boolean
     */
    public function validarExistenciaProdCantegDep($parametros)
    {
        $producto = new DatProductoLogistica();
        $idestructura = ($parametros['idestructura']) ? $parametros['idestructura'] :
            $parametros['idestructuracomun'];
        $datos = ($parametros['tarjeta']) ? Zend_Json::decode($parametros['tarjeta']) :
            Zend_Json::decode($parametros['data']);
        $idindicador = $datos['idindicador'];
        $idcategoria = $datos['idcategoria'];
        $idumedida = $datos['idunidadmedida'] ? $datos['idunidadmedida'] : $datos['idumedida'];
        $nroLote = false;
        if ($this->esFarmacia == 1) {
            $nroLote = $datos['numerolote'];
        }
        $cfgInv = array();
        if (class_exists("ConfiguracioninventarioService")) {
            $objConf = new ConfiguracioninventarioService();
            $cfgInv = $objConf->devolverConfiguracion($this->global->Estructura->idestructura);
        }
        return $producto->validarExistenciaProdCantegDep($idestructura, $idindicador, $idcategoria, $idumedida, $cfgInv, $nroLote);
    }

    /**
     * @param numeric $iddocumento
     * @param numeric $cronologia
     * @param boolean $isEntrada
     * @return boolean
     */
    public function cancelarMovimientos($iddocumento, $cronologia, $isEntrada = false)
    {
        return $this->movimientoModel->cancelarMovimientos($iddocumento, $cronologia, $isEntrada);
    }

    /**
     *
     * @param type $signo
     *
     * @return type
     */
    public function getSignoContrario($signo = LogisticaMovimientoModel::SIGNO_NINGUNO)
    {
        return $this->movimientoModel->getSignoContrario($signo);
    }

    /**
     *
     * @param type $fecha
     *
     * @return type
     */
    public function getProductosMovidosByFecha($fecha, $idDeposito = false, $idestructuraubicacion = false)
    {
        $nomenclador = new NomencladoresLogService();
        $qProdutos = $this->getQueryProducto('p');
        $nomenclador->innerJoinNomCategoria($qProdutos, 'p', 'nc');
        $this->maestroProductos->addQueryNomIndicador($qProdutos, 'p', ' i', 'ih');
//        $this->configuracionHelper->getQueryJoinUnidadMedida($qProdutos, 'i', 'umedida',
//            'umedida.abreviaturaunidadmedida as umedida', 'leftJoin'
//        );
        $this->movimientoModel->getJoinDatMovimiento($qProdutos, 'p', 'm');
        DocumentoLogisticaModel::getJoinDatDocumento($qProdutos, 'm', 'd');
        $qProdutos->addWhere("d.fechacontable = ?", $fecha);
        $qProdutos->andWhere("d.cronologia > 0");
        if ($idestructuraubicacion) {
            $qProdutos->addWhere("
                p.idproducto IN (
                    SELECT ubp.idproducto
                    FROM DatUbicacionproducto ubp
                    INNER JOIN ubp.DatEstructuraubicacion deu ON deu.idestructuraubicacion = ubp.idubicacion
                    WHERE deu.parentpath OPERATOR(public.<@) (SELECT e1.parentpath FROM DatEstructuraubicacion e1 WHERE e1.idestructuraubicacion = {$idestructuraubicacion} limit 1)
                )
            ");
        }
        if ($idDeposito) {
            $qProdutos->andWhere("p.idestructura = ?", array($idDeposito));
            $idsProductos = $this->getIdsProductosSolEntrega($idDeposito);
            if (count($idsProductos) > 0) {
                $qProdutos->andWhereNotIn("p.idproducto", $idsProductos);
            }
        }
        return $qProdutos->fetchArray();
    }

    /**
     * Metodo que devuelve los productos que ya se contaron en un inventario
     * parcial mensual.
     *
     * @param type $param
     *
     * @return SQL
     */
    public function getQueryProductosParcialMensual($param)
    {
        $dql = "select DISTINCT m.idproducto FROM DatMovimientos m "
            . "INNER JOIN m.DatDocumento dd INNER JOIN dd.DatInventario di "
            . "WHERE di.tipoinventario = 2 AND dd.idejercicio = {$param['idejercicio']} "
            . "AND dd.idestructuracomun = {$param['idestructura']}";
        $arrayData = $this->doctrineHelper->query($dql)->toArray();
        return $this->objectHelper->extractValueFromArrayColumn($arrayData, 'idproducto');
    }

    public function getProductosPorCiento($param)
    {
        $conExistenciaSql = "select count(nv.nombre) from mod_logistica.nom_variableglobal nv 
                          where nv.nombre = 'CONTEO_EXISTENCIA' and nv.valor = 'true'";
        $conExistencia = LogisticaDoctrineHelper::__init()->getConnection()->execute($conExistenciaSql)->fetchAll(PDO::FETCH_COLUMN);
        $conCantidad = "";
        if ($conExistencia[0] > 0) {
            $conCantidad = " and dp.cantidad > 0 ";
            $param['conexistencia'] = true;
        }
        $dqlLimit = "SELECT ceil((count(dp.idproducto) * {$param['porciento']})/100) as _limit "
            . "FROM DatProductoLogistica dp WHERE "
            . "dp.idestructura = {$param['idestructura']} and dp.cronologia > 0 {$conCantidad}";
        $limit = $this->doctrineHelper->query($dqlLimit)->toArray();
        $param['asentado'] = true;
        $queryProduct = $this->cargarProductos($param, true);
        $queryProduct->addSelect("(SELECT COUNT(DISTINCT m.idproducto) FROM DatMovimientos m "
            . "INNER JOIN m.DatDocumento dd INNER JOIN dd.DatInventario di "
            . "WHERE di.tipoinventario = 2 AND dd.idejercicio = {$param['idejercicio']} "
            . "AND dd.idestructuracomun = {$param['idestructura']} AND m.idproducto = p.idproducto) AS conteo");
        if ($param['idestructuraubicacion']) {
            $queryProduct->addWhere("
                p.idproducto IN (
                    SELECT ubp.idproducto
                    FROM DatUbicacionproducto ubp
                    INNER JOIN ubp.DatEstructuraubicacion deu ON deu.idestructuraubicacion = ubp.idubicacion
                    WHERE deu.parentpath OPERATOR(public.<@) (SELECT e1.parentpath FROM DatEstructuraubicacion e1 WHERE e1.idestructuraubicacion = {$param['idestructuraubicacion']} limit 1)
                )
            ");
            $queryProduct->addSelect("(SELECT up2.cantidad FROM DatUbicacionproducto up2 WHERE up2.idproducto = p.idproducto AND up2.idubicacion = {$param['idestructuraubicacion']}) as existencia");
        }
        $queryProduct->orderBy(
            "conteo ASC");
        //$prodMarcados = $this->getQueryProductosParcialMensual($param);
        //$queryProduct->andWhereNotIn("p.idproducto", $prodMarcados);
        $param['limit'] = $limit[0]['_limit'];
        $param['start'] = 0;
        return $this->doctrineHelper->addQueryLimits($queryProduct, $param)->fetchArray();
    }

    public function getIdsProductosSolEntrega($idDeposito)
    {
        $arrIdesProductos = array();
        $query = Doctrine_Query::create();
        $productos = $query->select('doc.iddocumento, m.idproducto as idproducto')
            ->from('DatDocumento doc')
            ->innerjoin('doc.DatMovimientos m')
            ->innerJoin('m.DatProductoLogistica dp')
            ->innerjoin('doc.DatDocumentoprim ddp')
            ->where("ddp.sigla ='solEntrega'")
            ->andwhereIn('dp.idestructura', $idDeposito)
            ->fetchArray();

        if (count($productos) > 0) {
            $arrIdesProductos = LogisticaObjectHelper::__init()->extractValueFromArrayColumn($productos, 'idproducto');
        }
        return $arrIdesProductos;
    }

    /**
     * Select SUM(dp.importe),nc.idcuenta,nc.idclasificacioncontable
     * From  mod_logistica.dat_producto dp
     * inner join mod_logistica.dat_movimiento dm on dp.idproducto = dm.idproducto
     * inner join mod_logistica.nom_clasificacioncontable nc on nc.idclasificacioncontable = dp.idclasificacioncontable
     * where dm.iddocumento = 1000066
     * group by nc.idcuenta,nc.idclasificacioncontable
     * maricet
     *
     * @param type $iddodocumento
     *
     * @return type
     */
    public function obtenerImporteTotalDocumento($iddodocumento)
    {
        $query = Doctrine_Query::create();
        return $query->select("SUM(dp.importe) as importedoc,nc.idcuenta as idcuneta ")
                ->from('DatProductoLogistica dp')
                ->innerjoin('dp.DatMovimientos dm')
                ->innerjoin('dm.NomClasificacioncontablelog nc')
                ->where('dm.iddocumento = ? ', $iddodocumento)
                ->groupBy('nc.idcuenta')
                ->fetchArray();
    }

    public function initRelations()
    {
        $relations = array();
        array_push(
            $relations,
            array(
            'cardinalidad' => 'one',
            'relation' => 'NomUnidadmedida',
            'properties' => array('local' => 'idumedida', 'foreign' => 'idunidadmedida')
            )
        );
        $this->doctrineHelper->tryInyectRelactions(new DatProductoLogistica, $relations);
        $relationsInd = array();

        array_push(
            $relationsInd,
            array(
            'cardinalidad' => 'many',
            'relation' => 'DatProductoLogistica',
            'properties' => array('local' => 'idindicador', 'foreign' => 'idindicador')
            )
        );
        $this->doctrineHelper->tryInyectRelactions(new NomIndicador, $relationsInd);
    }

    public function obtenerProductosEnDepositos($parametros, $idEntidad, $iddeposito = false)
    {
        $arrayIdIndicador = array();
        $arrayIdProducto = array();
        $arrayCantIndicador = array();
        $arrayCantProducto = array();
        $arrayResult = array();
        foreach ($parametros as $indicador) {
            if (isset($indicador['idproducto']) && is_numeric($indicador['idproducto'])) {
                $arrayIdProducto[] = $indicador['idproducto'];
                $arrayCantProducto[$indicador['idproducto']] = $indicador['cantidad'];
            } else {
                $arrayIdIndicador[] = $indicador['idindicador'];
                $arrayCantIndicador[$indicador['idindicador']][$indicador['idunidadmedida']] = $indicador['cantidad'];
            }
        }

        $dqlResult = $this->getQueryProducto('p')
                ->andWhere(
                    'p.idestructuracomun = ? and (p.cantidad - coalesce((SELECT sum(_cc.cantidad) '
                    . 'FROM DatCantidadesComprometidas _cc WHERE _cc.idproducto = p.idproducto '
                    . 'AND _cc.estado = 1), 0)) > 0', array($idEntidad)
                );

        if (count($arrayIdProducto)) {
            $dqlResult->andWhereIn('p.idproducto', $arrayIdProducto);
        } else {
            $dqlResult->andWhereIn('p.idindicador', $arrayIdIndicador);
        }

        if($iddeposito){
            $dqlResult = $dqlResult->andWhere('p.idestructura = ?', array($iddeposito))->fetchArray();
        }else{
            $dqlResult = $dqlResult->fetchArray();
        }
        foreach ($dqlResult as $producto) {
            if (!$arrayResult[$producto['idestructura']]) {
                $arrayResult[$producto['idestructura']] = array();
            }
            if (isset($arrayCantProducto[$producto['idproducto']]) && $arrayCantProducto[$producto['idproducto']] != 0) {
                $cantExtraer = ($arrayCantProducto[$producto['idproducto']] <= $producto['existencia']) ? $arrayCantProducto[$producto['idproducto']] : $producto['existencia'];
                $cantActualizar = ($arrayCantProducto[$producto['idproducto']] <= $producto['existencia']) ? 0 : ($arrayCantProducto[$producto['idproducto']]
                    - $producto['existencia']);
                $producto['cantidad'] = $cantExtraer;
                $arrayCantProducto[$producto['idproducto']] = $cantActualizar;
                array_push($arrayResult[$producto['idestructura']], $producto);
            }
            else if ($arrayCantIndicador[$producto['idindicador']][$producto['idumedidacrc']] != 0) {
                $cantExtraer = ($arrayCantIndicador[$producto['idindicador']][$producto['idumedidacrc']] <= $producto['existencia']) ? $arrayCantIndicador[$producto['idindicador']][$producto['idumedidacrc']] : $producto['existencia'];
                $cantActualizar = ($arrayCantIndicador[$producto['idindicador']][$producto['idumedidacrc']] <= $producto['existencia']) ? 0 : ($arrayCantIndicador[$producto['idindicador']][$producto['idumedidacrc']]
                    - $producto['existencia']);
                $producto['cantidad'] = $cantExtraer;
                $arrayCantIndicador[$producto['idindicador']][$producto['idumedidacrc']] = $cantActualizar;
                array_push($arrayResult[$producto['idestructura']], $producto);
            }
        }
        return $arrayResult;
    }

    public function checkProductosByParams($params)
    {
        $dql = $this->getQueryProducto('p')->select('p.idproducto');
        $this->addFiltersQueryDatProducto($dql, 'p', $params, false);
        return $dql->fetchOne();
    }

    public function addFiltroDocumentos(Doctrine_Query $query, $alias, $params = array())
    {
        if ($params['iddocumento']) {
            $query->leftJoin($alias . ".DatMovimientos m ON m.iddocumento = {$params['iddocumento']} "
                    . "and m.idproducto = p.idproducto")
                ->addWhere('m.idmovimiento IS NULL');
        }
    }

    public function existeIndicadorEstructura($param)
    {
        $query = Doctrine_Query::create();
        return $query->select(
                    "dp.idproducto, (dp.cantidad - coalesce((SELECT sum(_cc.cantidad) "
                    . "FROM DatCantidadesComprometidas _cc WHERE _cc.idproducto = dp.idproducto "
                    . "AND _cc.estado = 1), 0)) AS disponible"
                )
                ->from('DatProductoLogistica dp')
                ->where(
                    'dp.idindicador = ? and (dp.cantidad - coalesce((SELECT sum(_cc2.cantidad) '
                    . 'FROM DatCantidadesComprometidas _cc2 WHERE _cc2.idproducto = dp.idproducto '
                    . 'AND _cc2.estado = 1), 0)) > 0 ', array($param['idindicador'])
                )
                ->andwhereIn('dp.idestructura', $param['idestructura'])
                ->fetchArray();
    }

}
