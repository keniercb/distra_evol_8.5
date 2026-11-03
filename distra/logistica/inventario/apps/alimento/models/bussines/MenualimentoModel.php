<?php

/**
 * @class      MenualimentoModel
 * @package    Inventario
 * @subpackage Alimento
 * @author     Jorge Luis Saavedra Rubio
 * @copyright  XETID
 * @version    1.0
 */
class MenualimentoModel extends DocumentoLogisticaModel
{

    private $serviciosConfiguracion;
    private $maestroProducto;
    private $menu;

    public function __construct($datos = array())
    {
        parent::__construct($datos);
        $this->trazaDocumento = new TrazasDocumentoModel();
        $this->maestroProducto = new MaestroProductoModel();
        $this->menu = new DatMenu();
        $relationsP[] = array(
            'cardinalidad' => 'one',
            'relation'     => 'DatMenu',
            'properties'   => array('local' => 'iddocumento', 'foreign' => 'idmenu')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatDocumento(), $relationsP);
        $relationsS[] = array(
            'cardinalidad' => 'one',
            'relation'     => 'DatProductoMenu',
            'properties'   => array('local' => 'idproducto', 'foreign' => 'idproducto')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatProductoLogistica(), $relationsS);
        $relationsC[] = array(
            'cardinalidad' => 'one',
            'relation'     => 'DatActividad',
            'properties'   => array('local' => 'idactividadalimento', 'foreign' => 'idactividadalimento')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new NomActividadalimento(), $relationsC);
        $relationsQ[] = array(
            'cardinalidad' => 'one',
            'relation'     => 'DatProductoReceta',
            'properties'   => array('local' => 'idreceta', 'foreign' => 'idreceta')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatRecetaActividad(), $relationsQ);
        $relationsSe[] = array(
            'cardinalidad' => 'one',
            'relation'     => 'DatRecetaActividad',
            'properties'   => array('local' => 'idreceta', 'foreign' => 'idreceta')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatProductoReceta(), $relationsSe);

        $this->serviciosConfiguracion = ServiciosConfiguracionGeneralHelper::__init();
        $this->estadoModel = new EstadoDocumentoModel();
        $this->trazaDocumento = new TrazasDocumentoModel();
    }

    /**
     * @param array $pDatos
     * @param boolean $dql
     * @return array|Doctrine_Query
     */
    public function devolverDocumentos($pDatos = array(), $dql = false)
    {
        $query = parent::devolverDocumentos($pDatos);
        $this->menu->getSelectSinAlias($query, $pDatos);
        if ($dql) {
            return $query;
        }
        return array(
            'cantidad' => $query->count(),
            'datos' => $this->cargarClientesDocumentos(
                $this->logisticaDoctrine->addQueryLimits($query, $pDatos)->fetchArray()
            )
        );
    }

    function devolverNombreActividades($iddocumento)
    {
        $datos = $this->getCadenaNombreActividad($iddocumento);
        return $datos;
    }

    public function devolverCentroCosto($idcentrogrupo, $centros)
    {
        $res = '';
        foreach ($centros as $val) {
            if ($val->idcentrogrupo == $idcentrogrupo) {
                $res = $val->descripcioncentrogrupo;
            }
        }
        return $res;
    }

    public function devolverDeposito($iddeposito, $depositos)
    {
        $res = '';
        foreach ($depositos as $val) {
            if ($val['iddeposito'] == $iddeposito) {
                $res = $val['deposito'];
            }
        }
        return $res;
    }

    public function devolverRecetasNomencladas($pDatos = array())
    {
        $receta = new RecetaModel();
        $pDatos['entidad'] = true;
        $res = $receta->devolverRecetas($pDatos);
        foreach ($res['datos'] as $i => $rec) {
            $res['datos'][$i]['denominacionreceta'] = $res['datos'][$i]['denominacion'];
        }
        return $res;
    }

    public function devolverRecetaMenu($pDatos = array())
    {
        if ($pDatos['iddocumento']) {
            $res = $this->getRecetasMenu($pDatos);
            return array(
                'cantidad' => count($res),
                'datos'    => $res
            );
        }
        return false;
    }

    public function devolverProductos($pDatos = array())
    {
        if ($pDatos['iddocumento']) {
            $datos = $this->menu->getProductosActividades($pDatos);
            foreach ($datos as $key => $value) {
                $datos[$key]['idordenar'] = $key + 1;
            }
            return $datos;
        }
    }

    public function adicionarDocumento($pDatos = array())
    {
        $documento = parent::adicionarDocumento($pDatos);
        $datMenu = new DatMenu();
        if ($pDatos['iddocumento']) {
            $datMenu->assignIdentifier($pDatos['iddocumento']);
        }
        $datMenu->synchronizeWithArray(
            array(
                'fecha'         => $pDatos['fechaconsumo'],
                'idcentrocosto' => $pDatos['idcentrogrupo'],
                'idnorma'       => $pDatos['idnorma']
            )
        );
        $documento->DatMenu = $datMenu;
        foreach ($pDatos['listaRecetas']['actividades'] as $act) {
            $datActividad = new DatActividad();
            $bActividad = null;
            if ($act['idactividadalimento']) {
                $bActividad = Doctrine::getTable('DatActividad')
                    ->findByDql(
                        'idmenu = ? and idactividadalimento = ?',
                        array($pDatos['iddocumento'], $act['idactividadalimento'])
                    )
                    ->toArray();
                if (count($bActividad) > 0) {
                    $datActividad->assignIdentifier($bActividad[0]['idactividad']);
                    $cp['calorias'] = $datActividad->caloriastotal;
                    $cp['proteinas'] = $datActividad->proteinastotal;
                }
            }
            if (count($act['data']) > 0) {
                $cp = $datMenu->getCaloriasProteinas($act['data']);
            }
            $datActividad->synchronizeWithArray(
                array(
                    'idactividadalimento' => $act['idactividadalimento'],
                    'cantraciones'        => $act['racion'] ? $act['racion'] : 0,
                    'caloriastotal'       => $cp['calorias'],
                    'idusuario'           => $this->global->Perfil->idusuario,
                    'proteinastotal'      => $cp['proteinas'],
                    'orden'               => $act['orden'] ? $act['orden'] : null
                )
            );
            $datMenu->DatActividad->add($datActividad);
            if (count($act['data']) > 0) {
                foreach ($act['data'] as $idreceta) {
                    $datRecetaActividad = new DatRecetaActividad();
                    $bRecetaActividad = null;
                    if (count($bActividad) > 0) {
                        $bRecetaActividad = Doctrine::getTable('DatRecetaActividad')
                            ->findByDql('idactividad = ?', array($act['idactividadalimento']))
                            ->toArray();
                        if (count($bRecetaActividad) > 0) {
                            $datRecetaActividad->assignIdentifier($bRecetaActividad[0]['idrecetaactividad']);
                        }
                    }
                    $datRecetaActividad->synchronizeWithArray(array('idreceta' => $idreceta));
                    $datActividad->DatRecetaActividad->add($datRecetaActividad);
                }
            }
        }
        $idClientes[] = array(
            'idcliente'   => $pDatos['idcentrogrupo'],
            'tipocliente' => LogisticaGlobal::TIPO_CLIENTE_CENTRO
        );
        $documento->save();
        $this->adicionarClientes($documento->iddocumento, $idClientes, true);

        if ($pDatos['iddeposito'] && $documento->iddocumento) {
            $arrDat = array(
                'idmenu'   => $documento->iddocumento,
                'deposito' => $pDatos['iddeposito']
            );
            $this->salvarProductos($arrDat);
        }
        return array(
            'iddocumento'       => $documento->iddocumento,
            'nro'               => $documento->nrodoc,
            'fecha'             => $documento->fechacontable,
            'numeroref'         => $documento->numeroref,
            'estado'            => $documento->estado,
            'idusuario'         => $documento->idusuario,
            'idcentrocosto'     => $documento->DatMenu->idcentrocosto,
            'idnorma'           => $documento->DatMenu->idnorma,
        );
    }
    
    /**
     * Metodo para verificar si los productos de las recetas estan recpcionados
     * @param type $pDatos
     * @param type $deposito
     * @return boolean
     */
    public function verificarProductosByRecetas($pDatos = array(), $deposito)
    {
        $arrProd = Doctrine_Query::create()
            ->select("DISTINCT dpr.idindicador, nr.denominacion")
            ->from("NomReceta nr")
            ->innerJoin("nr.DatProductoReceta dpr")
            ->whereIn("nr.idreceta", $pDatos)
            ->andWhere("dpr.imprescindible = 1")->fetchArray();
        $datProducto = new DatProductoLogistica();
        foreach ($arrProd as $value) {
           foreach ($value['DatProductoReceta'] as $v) {
                $data = $datProducto->existeProducto($deposito, $v['idindicador']);
                if (!$data[0]['idproducto']) {
                    return false;
                }
           }
            
        }
        return true;
    }

    public function salvarProductos($pDatos = array())
    {
        $p = array('iddocumento' => $pDatos['idmenu']);
        $productos = $this->menu->getProductosMenu($p);
        $pDatos['productos'] = $productos;
        $this->salvarProductosMenu($pDatos);
        return true;
    }

    

    public function salvarProductosMenu($datos)
    {

        $productoModel = new LogisticaProductoModel();
        $collectionProductos = new Doctrine_Collection('DatProductoMenu');
        $datos['deposito'] = explode(',', $datos['deposito']);
        foreach ($datos['productos'] as $datosInd) {

             $query= $productoModel->cargarProductos(array('idestructura'=>$datos['deposito'],
                 'idindicador'=>$datosInd['idindicador']),true);
                 /*->addWhere("p.disponible > ? ", array($datosInd['cantidadtotal']));*/

           $productos = $query->fetchArray();
           $prodMenu = new DatProductoMenu();
            if (count($productos) > 0) {
                if ($datosInd['idproductomenu'] || $datosInd['idproductomenu'] = $prodMenu->existeProductoMenu(
                        $datos['idmenu'], $productos[0]['idproducto']
                    )
                ) {
                    if ($datosInd['idproductomenu']) {
                        $prodMenu->assignIdentifier($datosInd['idproductomenu']);
                    }
                }

            $prodMenu->synchronizeWithArray(
                array(
                    'idmenu'         => $datos['idmenu'],
                    'idproducto'     => $productos[0]['idproducto'],
                    'idindicador'    => $datosInd['idindicador'],
                    'cantidadtotal'  => $datosInd['cantidadtotal'],
                    'idunidadmedida' => $productos[0]['idumedida'],
                    'iddeposito' => $productos[0]['idestructura'],
                )
            );
            $collectionProductos->add($prodMenu);
            }
        }
        if ($collectionProductos->count()) {
            $collectionProductos->save();
        } else {
            throw new LogisticaException('LOG_LB_Alim_001');
        }
        return true;
    }

    public function eliminarDocumento($iddocumento)
    {
        $datActividad = Doctrine::getTable('DatActividad')->findByDql('idmenu = ?', array($iddocumento));
        $colACt = $datActividad->getData();
        foreach ($colACt as &$actividad) {
            $datRecetaActividad = Doctrine::getTable('DatRecetaActividad')->findByDql(
                'idactividad = ?', array($actividad['idactividad'])
            );
            $datRecetaActividad->delete();
        }
        $datProductoMenu = Doctrine::getTable('DatProductoMenu')->findByDql('idmenu = ?', array($iddocumento));
        $datProductoMenu->delete();
        return parent::eliminarDocumento($iddocumento);
    }

    public function copiarDocumento($iddocumento, $iddeposito)
    {
        $idCopia = parent::copiarDocumento($iddocumento, $sameDoc = false,  $cancelSigno = false);
        $colMenu = new Doctrine_Collection('DatMenu');
        $menu = Doctrine::getTable('DatMenu')->find($iddocumento);
        $nuevoMenu = $menu->copy();
        $datosMenu = $menu->toArray();
        $idmenu = $datosMenu['idmenu'];
        $datosMenu['idmenu'] = $idCopia;
        $nuevoMenu->synchronizeWithArray($datosMenu);
        $colMenu->DatMenu = $nuevoMenu;
        $actividades = Doctrine::getTable('DatActividad')->findByDql('idmenu = ?', array($idmenu));
        if ($actividades->count() > 0) {
            $datosActividades = $actividades->toArray();
            foreach ($datosActividades as $key => $value) {
                $actividad = new DatActividad();
                $datosActividad = $value;
                $datosActividad['idmenu'] = $idCopia;
                $actividad->synchronizeWithArray($value);
                $colMenu->DatMenu->DatActividad->add($actividad);
                $recetaAvtividad = Doctrine::getTable('DatRecetaActividad')->findByDql(
                    'idactividad = ?', array($value['idactividad'])
                );
                if ($recetaAvtividad->count()) {
                    $datosRecetaActividad = $recetaAvtividad->toArray();
                    foreach ($datosRecetaActividad as $v) {
                        $recetaActividad = new DatRecetaActividad();
                        $recetaActividad->synchronizeWithArray(
                            array(
                                'idactividad'        => $v['idactividad'],
                                'idreceta'           => $v['idreceta'],
                                'autorizadoentregar' => $v['autorizadoentregar'],
                            )
                        );
                        $colMenu->DatMenu->DatActividad[$key]->DatRecetaActividad->add($recetaActividad);
                    }
                }
            }
            $colMenu->save();
        }
        $this->salvarProductos(
            array(
                'idmenu'   => $colMenu->DatMenu->idmenu,
                /*'deposito' => $this->global->Estructura->idestructura*/
                'deposito' => $iddeposito
            )
        );
        return $colMenu->DatMenu->idmenu;
    }

    public function eliminarRecetas($pDatos = array())
    {
        $datActividad = Doctrine::getTable('DatActividad')->findByDql(
            'idmenu = ? and idactividadalimento = ?', array($pDatos['iddocumento'], $pDatos['tipoactividad'])
        );
        $arAct = $datActividad->toArray();
        if (count($arAct) > 0) {
            $recetas = $pDatos['idrecetas'];
            foreach ($recetas as $idreceta) {
                $datRecetaActividad = Doctrine::getTable('DatRecetaActividad')
                    ->findByDql('idactividad = ? and idreceta = ?', array($arAct[0]['idactividad'], $idreceta));
                $datRecetaActividad->delete();
            }
            $this->verificarActividadesMenu($pDatos['iddocumento']);
            return true;
        }
        return false;
    }

    public function devolverProductosMenu($pDatos = array())
    {
        return $this->obtenerProductos(
            array('idestructura' => $pDatos['iddeposito'], 'iddocumento' => $pDatos['iddocumento'])
        );
    }

    public function aprobarDocumento($iddocumento)
    {
        parent::aprobarDocumento($iddocumento, true);
        $mov = Doctrine::getTable('DatMovimientos')->findByDql('iddocumento = ?', array($iddocumento))->toArray();
        $collectCmplto = new Doctrine_Collection('DatProductocmplto');
        foreach ($mov as $item) {
            $cmplto = new DatProductocmplto();
            $cmplto->synchronizeWithArray(
                array(
                    'idproducto' => $item['idproducto'], 'iddocumento' => $iddocumento, 'cantidad' => $item['cantidad']
                )
            );
            $collectCmplto->add($cmplto);
        }
        if ($collectCmplto->count()) {
            $collectCmplto->save();
        }
        return true;
    }

    public function verificarProductosConfirmar($pDatos = array())
    {
        /*$pDatos['idestructura'] = $pDatos['idestructuracomun'];*/
        $data = $this->devolverProductosMenu($pDatos);
        foreach ($data as $producto) {
            if ($producto['colorize'] == 1) {
                return false;
            }
        }
        return true;
    }

    public function devolverProductoAlternativo($pDatos = array())
    {
        return $this->obtenerProductos(
                array(
                    'idestructura' => $pDatos['iddeposito'], 'codigoauxiliar' => $pDatos['codigoauxiliar'],
                    'idproducto' => $pDatos['idproducto']
                )
        );
    }

    public function alternarProductoMenu($pDatos = array())
    {
        $oldProducto = Doctrine::getTable('DatProductoMenu')->find($pDatos['idproductomenu']);
        $cantidad = $pDatos['cantidad'] * $oldProducto->cantidadtotal;
        $nProducto = new DatProductoMenu;
        $datosProducto = $this->obtenerProductos(
            array('iddocumento' => $pDatos['iddocumento'], 'idproducto' => $pDatos['idproducto'])
        );
        $nProducto->synchronizeWithArray(
            array(
                'idmenu'        => $pDatos['iddocumento'],
                'idindicador'   => $datosProducto['idindicador'],
                'cantidadtotal' => $cantidad,
                'idproducto'    => $pDatos['idproducto'],
            )
        );
        $oldProducto->delete();
        $nProducto->save();
        return false;
    }

    public function eliminarProductosMenu($pDatos = array())
    {
        $datProductoMenu = Doctrine::getTable('DatProductoMenu')->findByDql(
            'idmenu = ? and idindicador = ?', array($pDatos['iddocumento'], $pDatos['idindicador'])
        );
        $datProductoMenu->delete();
        return true;
    }

    public function salvarConclusionMedica($params)
    {

        $objDatAct = Doctrine::getTable('DatActividad')->find($params['data'][0]['idactividad']);
        $objDatAct->observacioncalidad = $params['data'][0]['conclusion'];
        $objDatAct->aprobadocalidad = $params['data'][0]['calidad'];
        $objDatAct->save();
        return true;
    }

    public function autorizarEntregarAlimentos($params)
    {

        $objDatAct = Doctrine::getTable('DatActividad')->find($params['data'][0]['idactividad']);
        $objDatAct->idusuario = $this->global->Perfil->idusuario;
        $objDatAct->save();
        $objRecAct = Doctrine::getTable('DatRecetaActividad')->findByDql(
            'idactividad = ?', array($params['data'][0]['idactividad'])
        );
        foreach ($objRecAct as $obj) {
            $obj->autorizadoentregar = 1;
        }
        $objRecAct->save();
        return true;
    }

    public function devolverActividadesMenu($pDatos = array())
    {
        $datos = Doctrine_Query::create()
            ->select("na.*")
            ->from("NomActividadalimento na")
            ->innerJoin("na.DatActividadalimentoEntidad dra")
            ->where("dra.idestructuracomun = ?", array($pDatos['idestructuracomun']))
            ->fetchArray();
        return array(
            'cantidad' => count($datos),
            'datos'    => $datos
        );
    }

    public function devolverCategorias($pDatos = array())
    {
        $res = $this->devolverCategoriasDetalles($pDatos['iddocumento']);
        return array(
            'cantidad' => count($res),
            'datos'    => $res
        );
    }

    public function revisadoPor($iddocumento)
    {
        $prodMenu = Doctrine::getTable('DatMenu')->find($iddocumento);
        $prodMenu->idrevisadopor = $this->global->Perfil->idusuario;
        $prodMenu->save();
        $this->trazaDocumento->guardarTraza('Documento revisado', $iddocumento, EstadoDocumentoModel::ESTADO_REVISADO);
        return $this->estadoModel->setEstadoDocumento($iddocumento, EstadoDocumentoModel::ESTADO_REVISADO);
    }

    public function getCadenaNombreActividad($iddocumento)
    {
        $dq = Doctrine_Query::create()
            ->select("na.denominacion as denominacion, na.idactividadalimento, da.idactividad as idactividad")
            ->from('NomActividadalimento na')
            ->leftJoin('na.DatActividad da')
            ->where('da.idmenu =?', array($iddocumento));
        $data = $dq->fetchArray();
        $res = "";
        foreach ($data as $key => $value) {
            $res .= $value['denominacion'];
            if ((count($data) - 1) == $key) {
                $res .= ".";
            } else {
                $res .= ",";
            }
        }
        return $res;
    }

    public function getRecetasMenu($pDatos = array())
    {
        $query = Doctrine_Query::create()
            ->select(
                "COALESCE(da.cantraciones, 0) as cantidad,
                    COALESCE(um.abreviaturaunidadmedida, 'ninguna') as umedida,
                    COALESCE(da.cantraciones, 0) as cantraciones,
                    nr.denominacion as denominacionreceta,                    
                    dra.autorizadoentregar as autorizadoentregar,                    
                    da.idactividad as idactividad,
                    da.observacioncalidad as observacioncalidad,
                    da.aprobadocalidad as aprobadocalidad,
                    da.idusuario as ooficialguardia,
                    da.caloriastotal as caloriastotal,
                    da.proteinastotal as proteinastotal,
                    da.cantraciones as cantraciones,
                    nr.idreceta,
                    dra.idreceta,
                    da.idactividadalimento as idactividadalimento,
                    da.orden as orden"
            )
            ->from('NomReceta nr')
            ->innerJoin('nr.DatRecetaActividad dra ON nr.idreceta = dra.idreceta')
            ->innerJoin('dra.DatActividad da')
            ->where(
                "da.idmenu =? and da.idactividadalimento =?", array($pDatos['iddocumento'], $pDatos['idComponent'])
            );
        $this->configuracionHelper->getQueryJoinUnidadMedida(
            $query, 'nr', 'um', 'um.abreviaturaunidadmedida as desumedida', 'leftJoin'
        );
        if ($pDatos['criterio']) {
            $query->addWhere("nr.denominacion ILIKE '%{$pDatos['criterio']}%'");
        }
        return $query->fetchArray();
    }

    public function getNombreUsuario($idusuario)
    {
        $query = Doctrine_Query::create()
            ->select("se.nombreusuario as denominacionrevisado")
            ->from('SegUsuario se')
            ->where("se.idusuario =?", array($idusuario));
        $res = $query->fetchArray();
        if (count($res)) {
            return $res[0]['denominacionrevisado'];
        }
        return "ninguno";
    }

    public function devolverCategoriasDetalles($iddocumento)
    {
        $query = Doctrine_Query::create()
            ->select("da.idactividadalimento, na.denominacion as denominacion")
            ->from('DatActividad da')
            ->innerJoin('da.NomActividadalimento na')
            ->where("da.idmenu =?", array($iddocumento));
        return $query->fetchArray();
    }

    public function getEstadoProducto($idindicador, $iddocumento)
    {
        $query = Doctrine_Query::create()
            ->select("dpr.imprescindible, dpr.aceptalternativo")
            ->from('DatProductoReceta dpr')
            ->innerJoin('dpr.NomReceta nr')
            ->innerJoin('nr.DatRecetaActividad dra')
            ->innerJoin('dra.DatActividad da')
            ->innerJoin('da.DatMenu dm')
            ->where("dpr.idindicador =? AND dm.idmenu =?", array($idindicador, $iddocumento));
        return $query->fetchArray();
    }

    public function verificarActividadesMenu($iddocumento)
    {
        $actividades = Doctrine::getTable('DatActividad')->findByDql('idmenu = ?', array($iddocumento))->toArray();
        foreach ($actividades as $value) {
            $actR = Doctrine::getTable('DatRecetaActividad')->findByDql('idactividad = ?', array($value['idactividad']))
                ->toArray();
            if (count($actR) == 0) {
                $a = Doctrine::getTable('DatActividad')->find($value['idactividad']);
                $a->delete();
            }
        }
    }

    /**
     * Devuelve un arreglo con los productos del menu.
     * @param array $filtro
     * @param boolean $dql
     * @return array|Doctrine_Query
     */
    public function obtenerProductos($filtro, $dql = false)
    {


        /*$query = "SELECT distinct dpr.idindicador,
                    (SELECT sum(prc.cantidad)
                    FROM mod_logalimento.dat_recetaactividad rac
                    INNER JOIN mod_logalimento.dat_productoreceta prc on prc.idreceta = rac.idreceta
                    WHERE prc.idindicador = ni.idindicador and rac.idactividad = da.idactividad) as cantidad,
                    na.denominacion as tipoactividadetalle,
                    da.idactividad,
                    da.cantraciones as cantraciones,
                    ni.denominacion as denominacion,
                    COALESCE(um.abreviaturaunidadmedida, 'ninguna') as umedida ,
                    (SELECT sum(prc.cantidad) * da.cantraciones
                        FROM  mod_logalimento.dat_recetaactividad rac
                        INNER JOIN mod_logalimento.dat_productoreceta prc on prc.idreceta = rac.idreceta
                        WHERE prc.idindicador = ni.idindicador and rac.idactividad = da.idactividad) as cantidadtotal
                    FROM mod_logalimento.dat_actividad da
                    INNER JOIN mod_logalimento.dat_recetaactividad dra on dra.idactividad = da.idactividad
                    INNER JOIN mod_logalimento.dat_productoreceta dpr on dpr.idreceta = dra.idreceta
                    INNER JOIN mod_datosmaestros.nom_indicador ni on ni.idindicador = dpr.idindicador
                    LEFT JOIN mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = ni.idumedida
                    LEFT JOIN mod_logalimento.nom_actividadalimento na
                    on na.idactividadalimento = da.idactividadalimento
                    WHERE da.idmenu = {$pDatos['iddocumento']} {$filtro}
                    ORDER BY na.denominacion";*/


        if ($filtro['codigoauxiliar'] && $filtro['idproducto']) {
            $filtro['idprod'] = $filtro['idproducto'];
            $filtro['codAux'] = $filtro['codigoauxiliar'];
            unset($filtro['idproducto']);
            unset($filtro['codigoauxiliar']);
        }
        $query = $this->getProductoModel()->cargarProductos($filtro, true);
        $query->addSelect("p.idumedida as idunidadmedida");
        if ($filtro['iddocumentos']) {
            if (!is_array($filtro['iddocumentos'])) {
                $filtro['iddocumentos'] = array($filtro['iddocumentos']);
            }
            $id = implode(',', $filtro['iddocumentos']);
            $query->addSelect(
                    "pm.cantidadtotal AS cantidadtotal, pm.idproductomenu AS idproductomenu, "
                    . "(SELECT count(nc1.idcategoria) FROM DatProductoLogistica p1 "
                    . "INNER JOIN p1.NomCategoriasproducto nc1 ON nc1.idcategoria = p1.idcategoria "
                    . "WHERE p1.idproducto = p.idproducto) AS cantcategoria, "
                    . "(CASE WHEN p.disponible < pm.cantidadtotal THEN 1 ELSE 0 END) AS colorize, "
                    . "(SELECT dpr.aceptalternativo FROM DatProductoReceta dpr INNER JOIN dpr.NomReceta nr "
                    . "ON nr.idreceta = dpr.idreceta INNER JOIN nr.DatRecetaActividad dra "
                    . "ON dra.idreceta = nr.idreceta INNER JOIN dra.DatActividad da "
                    . "ON da.idactividad = dra.idactividad INNER JOIN da.DatMenu m2 ON m2.idmenu = da.idmenu "
                    . "WHERE dpr.idindicador = i.idindicador AND m2.idmenu IN ({$id}) LIMIT 1) AS aceptalternativo, "
                    . "(SELECT dpr2.imprescindible FROM DatProductoReceta dpr2 INNER JOIN dpr2.NomReceta nr2 "
                    . "ON nr2.idreceta = dpr2.idreceta INNER JOIN nr2.DatRecetaActividad dra2 "
                    . "ON dra2.idreceta = nr2.idreceta INNER JOIN dra2.DatActividad da2 "
                    . "ON da2.idactividad = dra2.idactividad INNER JOIN da2.DatMenu m3 ON m3.idmenu = da2.idmenu "
                    . "WHERE dpr2.idindicador = i.idindicador AND m3.idmenu IN ({$id}) LIMIT 1) AS imprescindible"
                )
                ->innerJoin('p.DatProductoMenu pm')
                ->innerJoin('pm.DatMenu m')
                ->andWhereIn('m.idmenu', $filtro['iddocumentos']);
        }
        if ($filtro['codAux'] && $filtro['idprod']) {
            $query->addWhere(
                'ih.codigoauxiliar = ? and p.idproducto <> ?', array($filtro['codAux'], $filtro['idprod'])
            );
        }
        if ($filtro['idcentro']) {
            $query->addWhere('m.idcentrocosto = ?', array($filtro['idcentro']));
        }

        if ($dql) {
            return $query;
        }

        return array(
            'cantidad' => $query->count(),
            'datos' => $this->doctrineHelper->addQueryLimits($query, $filtro)->orderBy('p.idestructura')->fetchArray(),
            'success' => true
        );
    }
}
