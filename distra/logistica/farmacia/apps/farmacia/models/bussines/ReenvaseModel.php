<?php

/**
 * @class      ReenvaseModel
 * @package    Farmacia
 * @subpackage farmacia
 * @author     Manuel Yhon Figueroa
 * @copyright  XETID
 * @version    1.0
 */
class ReenvaseModel extends DocumentoLogisticaModel
{
    private $_confGeneral,
          $_productoModel,
          $_maestroProductos,
          $_movimientoModel,
          $_ubicacionService,
          $_loteService;
    public function __construct($datosDoc = array())
    {
        parent::__construct($datosDoc);
        $this->_confGeneral = new ConfGeneralModel();
        $this->_productoModel = new LogisticaProductoModel();
        $this->_maestroProductos = new MaestroProductoModel();
        $this->_movimientoModel = new LogisticaMovimientoModel;
        $this->_ubicacionService = new UtilesubicacionService();
        $this->_loteService = new LoteService();
        $this->tryInyector();

    }

    private function tryInyector()
    {
        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatReenvase',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'idreenvase')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatDocumento(), $relations);

        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatProdreenvase',
            'properties' => array('local' => 'idreenvase', 'foreign' => 'idreenvase')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatReenvase(), $relations);

        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatProdreenvasado',
            'properties' => array('local' => 'idreenvase', 'foreign' => 'idreenvase')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatReenvase(), $relations);

        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatLotereenvase',
            'properties' => array('local' => 'idreenvase', 'foreign' => 'idreenvase')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatReenvase(), $relations);

        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatProductoLogistica',
            'properties' => array('local' => 'idprodorigen', 'foreign' => 'idproducto')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatProdreenvase(), $relations);

        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatProductoLogistica',
            'properties' => array('local' => 'idproddestino', 'foreign' => 'idproducto')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatProdreenvasado(), $relations);

        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatCodificador',
            'properties' => array('local' => 'idindicador', 'foreign' => 'idindicador')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new NomIndicador(), $relations);
    }

    public function cargaInicial()
    {
        $datosIniciales = array();
        $datos = parent::cargaInicial();
        $entidad = $this->estructuraHelper->getEstructura($this->idestructuracomun);
        $datosIniciales['entidad'] = $entidad[0]->denominacion;
        $datosIniciales['identidad'] = $entidad[0]->idestructura;
        $datosIniciales['fechacontable'] = $this->configuracionHelper->getFechaContableSubsistema(
            $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_FARMACIA
        );
        $datos['encabezado'] = $datosIniciales;
        return $datos;
    }

    public function confirmarDocumento($iddocumento)
    {
        parent::confirmarDocumento($iddocumento);
        array(
            array(
                'iddocumento' => $iddocumento,
                'idproducto' => 11111111,
                'cantidad' => 35,
                'signo' => '-'
            ),
            array(
                'iddocumento' => $iddocumento,
                'idproducto' => 11111111,
                'cantidad' => 35,
                'signo' => '+'
            )
        );
        return true;
    }

    public function contieneProductosOrigen($iddocumento)
    {
        $datreenvase = new DatProdreenvase();
        $datosReenvase = $datreenvase->devolverProductos(implode(',', Zend_Json::decode($iddocumento)), false);
        if ($datosReenvase[0]['cantidad'] > 0) {
            return true;
        }
        return false;
    }

    public function contieneProductosDestino($iddocumento)
    {
        $datreenvasado = new DatProdreenvasado();
        $datosReenvasado = $datreenvasado->devolverProductos(implode(',', Zend_Json::decode($iddocumento)), false);
        if ($datosReenvasado[0]['cantidad'] > 0) {
            return true;
        }
        return false;
    }

    public function devolverDocumentos($params)
    {
        $sql =  " SELECT d.*, dr.*, su.nombreusuario as creadopor, sua.nombreusuario as aprobadopor
            ,coalesce(round(dr.importecosto, 2), 0) as importecostodif, coalesce(round(dr.importeventa, 2), 0) as importeventadif
            ,(case when (dlr.diferencia) > 0 then 2 when (dlr.diferencia) < 0 then 1 else 0 end) as diferencia
            ,dpr.idprodreenvase as idprodreenvase, dpr.idprodorigen as idprodorigenreenvase, dpr.cantorigen as cantidad, dpr.dosisunitaria as dosisunitaria
            ,dprdo.idprodreenvasado as idprodreenvasado, dpr.idprodorigen as idprodorigenreenvasado, dprdo.cantdestino as cantidaddest, dprdo.dosisunitariadestino as dosisunitariadestino
            ,dpl.idproducto as idproductoorigen, round(dpl.cantidad,6) as existenciaorigen
            ,dpl.precio as preciocosto
            ,ni.denominacion as productoorigen
            ,round((dpl.cantidad * dpl.precio),2) as importecosto
            ,dpldo.idproducto as idproductodestino, dpldo.cantidad as existenciadestino
            ,dpldo.precio as preciocostodestino
            ,round((dpldo.cantidad * dpldo.precio),2) as importecostodestino
            ,nido.denominacion as productodestino
            ,dm.idmovimiento as idmovimiento
            ,ni.codigo as codigoorigen
            ,nido.codigo as codigodestino
            ,de.denominacion as area";

        $from = " FROM mod_logfarmacia.dat_reenvase dr
                 INNER JOIN mod_logistica.dat_documento d ON dr.idreenvase = d.iddocumento

                 LEFT JOIN mod_logfarmacia.dat_prodreenvase dpr on dpr.idreenvase = dr.idreenvase
                 LEFT JOIN mod_logfarmacia.dat_prodreenvasado dprdo on dprdo.idreenvase = dr.idreenvase
                 LEFT JOIN mod_logistica.dat_producto dpl on dpl.idproducto = dpr.idprodorigen
                 LEFT JOIN mod_logistica.dat_producto dpldo on dpldo.idproducto = dprdo.idproddestino
                 LEFT JOIN mod_logfarmacia.dat_lotereenvase dlr on dlr.idprodorigen = dpr.idprodorigen
                 LEFT JOIN mod_datosmaestros.nom_indicador ni on ni.idindicador = dpl.idindicador
                 LEFT JOIN mod_datosmaestros.nom_indicador nido on nido.idindicador = dpldo.idindicador
                 LEFT JOIN mod_logistica.dat_movimiento dm on dm.iddocumento = dr.idreenvase
                 LEFT JOIN mod_estructuracomp.dat_estructuraop de on de.idestructuraop = dr.idarea
                 LEFT JOIN mod_seguridad.seg_usuario su ON d.idusuario = su.idusuario
                 LEFT JOIN mod_seguridad.seg_usuario sua ON d.aprobadopor = sua.idusuario
                 ";
            $where = " WHERE (d.iddoc = {$this->getIddoc()} )and d.estado in (1, 2, 3)
             and (d.idestructuracomun = {$this->idestructuracomun} )";

        $where = $this->getFiltrosDocumento($params, $where);
        $orderBy = "ORDER BY d.numeroref DESC  ";
        $conn = Zend_Registry::get('conexion');
        $result = $conn->fetchAll($sql.$from.$where.$orderBy
        );

        return array('datos'=>$result, 'cantidad'=>count($result));

    }

    public function getFiltrosDocumento($params, $where)
    {
        if ($params['estado']) {
            $where .= " and d.estado = {$params['estado']}";
        }
        if ($params['criterio']) {
            $where.=" AND d.nrodoc = {$params['criterio']} OR d.numeroref = {$params['criterio']}";
        }
        if ($params['idprodorigen']) {
            $where.=" AND dpl.idproducto = ({$params['idprodorigen']})";
        }
        if ($params['idproddestino']) {
            $where.=" AND dpldo.idproducto = ({$params['idproddestino']})";
        }
        if ($params['aprobadopor']) {
            $where .= " and d.aprobadopor = {$params['aprobadopor']}";
        }
        if ($params['creadopor']) {
            $where .= " and d.idusuario = {$params['creadopor']}";
        }
        if ($params['desde']) {
            $where .= " and d.fechacontable >= '{$params['desde']}'";
        }
        if ($params['hasta']) {
            $where .= " and d.fechacontable <= '{$params['hasta']}'";
        }

        return $where;
    }

    public function cargarDepositos($params)
    {
        $datos = array();
        $pos = 0;
        $config = $this->_confGeneral->cargaInicial(array('idestructura' => $this->global->Estructura->idestructura));
        $depositos = $this->_confGeneral->cargardepositos($params);
        foreach ($depositos as $index => $r) {
                $datos[$pos]['idarea'] = $r['idfila'];
                $datos[$pos]['denominacion'] = $r['DatEstructuraop'][0]['text'];
                $datos[$pos]['codigo'] = $r['DatEstructuraop'][0]['codigo'];
                $pos++;
        }

        return $datos;
    }

    public function cargarProductos($params)
    {
        if ($params['fpresentacion'] && $params['idproducto']) {
            $query1 = " select coalesce(sum(dpr.cantorigen),0) as cantidaddest  from mod_logfarmacia.dat_prodreenvase dpr
                inner join mod_logfarmacia.dat_prodreenvasado dpre on dpre.idprodorigen = dpr.idprodorigen
                inner join mod_logistica.dat_producto dp on dp.idproducto = dpr.idprodorigen
                where dp.idestructuracomun = {$this->global->Estructura->idestructura} and dpr.idprodorigen = {$params['idproducto']}";
            $conn = Zend_Registry::get('conexion');
            $prod1 = $conn->execute($query1)->fetchAll(PDO::FETCH_ASSOC);
        }

        unset($params['idproducto']);

        $query = $this->_productoModel->cargarProductos($params, true);
        if ($params['fpresentacion'] ) {
            $query->addSelect("{$prod1[0]['cantidaddest']} as cantidaddest");
        }

        return $this->_productoModel->concatenarDeposito(
            array(
                'cantidad' => $query->count(),
                'datos' => $this->_maestroProductos->setLastLevel(
                    $this->doctrineHelper->addQueryLimits($query, $params)
                        ->orderBy("p.idestructura")->addOrderBy('i.codigo ASC')->fetchArray()
                )
            )
        );
    }
    public function cargarLotes($params)
    {
        $cEstructura = $this->global->Estructura->idestructura;
        $select = " select l.idlote, l.idproducto,l.fechafabricacion, l.fechavencimiento, l.existencia as cantidad,
        l.numero as nrolote, coalesce(l.existencia, 0) existencia,
        (coalesce(l.existencia, 0) - coalesce((select sum(lc.cantidad) from mod_logistica.dat_lotecomprometido lc where lc.idlote = l.idlote and lc.estado = 1), 0)) as disponible,
        eu.descripcion AS ubicacion ";

        $from = " from mod_logistica.dat_producto pp
        inner join mod_logistica.dat_lote l on l.idproducto = pp.idproducto
        inner join mod_logubicacion.dat_ubicacionlote ul on ul.idlote = l.idlote
        inner join mod_logubicacion.dat_estructuraubicacion eu on eu.idestructuraubicacion = ul.idubicacion ";
        $where = " where pp.idestructuracomun = {$cEstructura} and l.idproducto = {$params['idproducto']}";

        if (count($params['excluir']) > 0) {
            $params['excluir'] = implode(',', $params['excluir']);
            $where .= " and l.idlote not in ({$params['excluir']})";
        }
        $total = LogisticaDoctrineHelper::__init()->getConnection()->execute(
            $select. $from. $where
        )->fetchAll();
        if ($params['limit']) {
            $where .= " offset({$params['start']}) limit({$params['limit']})";
        }

        $datos = LogisticaDoctrineHelper::__init()->getConnection()->execute(
            $select. $from. $where
        )->fetchAll();

        return array($datos, count($total));
    }

    public function devolverLotes($params)
    {
        $conn = Zend_Registry::get('conexion');
        $cEstructura = $this->global->Estructura->idestructura;
        $select = " select l.idlote, l.idproducto, l.fechafabricacion, l.fechavencimiento, l.existencia as cantidad,
        l.numero as nrolote, coalesce(l.existencia, 0) existencia,
        (coalesce(l.existencia, 0) - coalesce((select sum(lc.cantidad) from mod_logistica.dat_lotecomprometido lc where lc.idlote = l.idlote and lc.estado = 1), 0)) as disponible,
        dlr.idlotereenvase, dlr.cantorigen, dlr.dosisunitreal as dosisunitariareal,
        coalesce(dlr.cantdestino, 0) as cantdestino, coalesce(dlr.cantrealreenvasada, 0) as cantrealreenvasada, coalesce(dlr.diferencia, 0) as diferencia, dpro.idproddestino";
        $from = " from mod_logfarmacia.dat_lotereenvase dlr
        inner join mod_logistica.dat_lote l on l.idlote = dlr.idlote
        inner join mod_logistica.dat_producto dp on dp.idproducto = l.idproducto
        left join mod_logfarmacia.dat_prodreenvase dpr on dpr.idprodorigen = dp.idproducto
        left join mod_logfarmacia.dat_prodreenvasado dpro on dpr.idprodorigen = dpro.idprodorigen";
        $where = " where dp.idestructuracomun = {$cEstructura} and dpr.idreenvase = {$params['iddocumento']} order by l.idlote desc";
        if($params['origen']){

             if ($params['limit']) {
                $where .= " offset({$params['start']}) limit({$params['limit']}) ";
            }
            $datosDoc = $conn->execute($select. $from. $where)->fetchAll(PDO::FETCH_ASSOC);
            return array('datos'=> $datosDoc, 'cantidad'=> count($datosDoc));
        }elseif ($params['destino']) {
            $datosDocaux = $conn->execute($select. $from. $where)->fetchAll(PDO::FETCH_ASSOC);
            if($datosDocaux[0]['idproddestino']){
                if($datosDocaux[0]['fechafabricacion'] != ""){
                    $querydest= "select l.idlote, l.fechafabricacion, l.fechavencimiento, l.numero as nrolote
                    from mod_logistica.dat_lote l
                    inner join mod_logfarmacia.dat_prodreenvasado dpro on l.idproducto = dpro.idproddestino
                    where l.fechafabricacion= '{$datosDocaux[0]['fechafabricacion']}' and l.idproducto = {$datosDocaux[0]['idproddestino']} and
                    l.fechavencimiento ='{$datosDocaux[0]['fechavencimiento']}' and dpro.idreenvase = {$params['iddocumento']} and l.numero = '{$datosDocaux[0]['nrolote']}'";
                    $existe = $conn->execute($querydest)->fetchAll(PDO::FETCH_ASSOC);
                    if(count($existe) == 0) {
                        unset($datosDocaux[0]['idproducto']);
                        unset($datosDocaux[0]['idlote']);
                        unset($datosDocaux[0]['disponible']);
                        unset($datosDocaux[0]['existencia']);
                        unset($datosDocaux[0]['estado']);
                        $obLote = new DatLote();
                        $obLote->synchronizeWithArray($datosDocaux[0]);
                        $obLote->idproducto = $datosDocaux[0]['idproddestino'];
                        $obLote->numero = $datosDocaux[0]['nrolote'];
                        $obLote->existencia = '0';
                        $obLote->save();
                    }
                    $querydest= "select l.idlote, l.fechafabricacion, l.fechavencimiento, l.numero as nrolote, l.existencia,
                        dlr.cantdestino, dlr.cantrealreenvasada, dlr.diferencia
                        from mod_logfarmacia.dat_lotereenvase dlr
                        inner join mod_logfarmacia.dat_prodreenvasado dpro on dpro.idprodorigen= dlr.idprodorigen
                        inner join mod_logistica.dat_lote l on l.idproducto = dpro.idproddestino
                        inner join mod_logistica.dat_producto dp on dp.idproducto = l.idproducto
                        where l.fechafabricacion= '{$datosDocaux[0]['fechafabricacion']}' and
                        l.fechavencimiento ='{$datosDocaux[0]['fechavencimiento']}' and
                        dp.idestructuracomun = {$cEstructura} and
                        dpro.idreenvase = {$params['iddocumento']} order by l.idlote desc";

                        $datosDoc = $conn->execute($querydest)->fetchAll(PDO::FETCH_ASSOC);
                        return array('datos'=> $datosDoc, 'cantidad'=> count($datosDoc));
                }else{
                    $querydest= "select l.idlote, l.fechafabricacion, l.fechavencimiento, l.numero as nrolote, l.existencia,
                        dlr.cantdestino, dlr.cantrealreenvasada, dlr.diferencia
                        from mod_logfarmacia.dat_lotereenvase dlr
                        inner join mod_logfarmacia.dat_prodreenvasado dpro on dpro.idprodorigen= dlr.idprodorigen
                        inner join mod_logistica.dat_producto dp on dp.idproducto = dpro.idprodorigen
                        inner join mod_logistica.dat_lote l on l.idproducto = dp.idproducto
                        where l.fechavencimiento ='{$datosDocaux[0]['fechavencimiento']}' and
                        dp.idestructuracomun = {$cEstructura} and
                        dpro.idreenvase = {$params['iddocumento']} order by l.idlote desc";
                    $existe = $conn->execute($querydest)->fetchAll(PDO::FETCH_ASSOC);
                    if(count($existe) == 0) {
                        unset($datosDocaux[0]['idproducto']);
                        unset($datosDocaux[0]['idlote']);
                        unset($datosDocaux[0]['disponible']);
                        unset($datosDocaux[0]['existencia']);
                        unset($datosDocaux[0]['estado']);
                        $obLote = new DatLote();
                        $obLote->synchronizeWithArray($datosDocaux[0]);
                        $obLote->idproducto = $datosDocaux[0]['idproddestino'];
                        $obLote->numero = $datosDocaux[0]['nrolote'];
                        $obLote->existencia = '0';
                        $obLote->save();
                    }
                    if ($params['limit']) {
                        $where .= " offset({$params['start']}) limit({$params['limit']}) ";
                    }
                    $datosDoc = $conn->execute($querydest)->fetchAll(PDO::FETCH_ASSOC);
                    return array('datos'=> $datosDoc, 'cantidad'=> count($datosDoc));

                }

        }

        }

        return array('datos'=> array(), 'cantidad'=> 0);
    }

    /**
     * Adiciona un nuevo documento de reenvase.
     * @param array $datosDoc Arreglo de datos del documento con los lotes del producto.
     * @return numeric
     */
    public function adicionarDocumento($datosDoc)
    {
        $this->objectHelper->unsetNullValues($datosDoc);
        $documento = parent::adicionarDocumento($datosDoc);
        $reenvase = new DatReenvase();
        if ($datosDoc['iddocumento']) {
            $reenvase->assignIdentifier($datosDoc['iddocumento']);
        }
        $reenvase->synchronizeWithArray($datosDoc);
        $documento->DatReenvase = $reenvase;
        $documento->save();
        if ($datosDoc['idprodreenvasado']) {
            $this->modificarProductoReenvasado($datosDoc);
        }else{
            $producto = $this->adicionarProducto($datosDoc, $documento->iddocumento);
        }

        //adicionar movimiento de salida

        if ($datosDoc['arrayLotes']) {
            $datosDoc['iddocumento'] = $documento->iddocumento;
            $this->adicionarProdReenvase($datosDoc, $producto->idprodorigen, false);
        }
        return array(
             'iddocumento' => $documento->iddocumento, 'numeroref' => $documento->numeroref,
            'fechacontable' => $documento->fechacontable, 'idarea' => $reenvase->idarea
        );
    }

    public function adicionarProductoDestino($datosDoc)
    {
      // try {
            if ($datosDoc['idindicador']) {
                $query1 = " select dp.idproducto as idproducto
                from mod_logistica.dat_producto dp
                where dp.idestructuracomun = {$this->global->Estructura->idestructura}
                and dp.idindicador = {$datosDoc['idindicador']}";
                $prod1 = LogisticaDoctrineHelper::__init()->getConnection()->execute($query1)->fetchAll();
            }

            $datosDoc['idproductodestino'] = ($datosDoc['idindicador']) ? $prod1[0]['idproducto'] : $datosDoc['idproducto'];
            $this->adicionarProductoReenvasado($datosDoc);
            if ($datosDoc['arrayLotes']) {
                $this->_loteService->adicionarLote($datosDoc['arrayLotes'], $params);
            }
            return array(
                'success'=> true,
                'datosProd'=> $this->getDatosProducto($datosDoc)
            );
        /*}
        catch (Doctrine_Exception $e) {
           return false;
        }*/
    }
    public function getDatosProducto($params)
    {
        if ($params['idindicador']) {
            $condition = " and dp.indicador = {$params['idindicador']}";
        } else {
            $condition = " and dp.idproducto = {$params['idproducto']}";
        }

        $query1 = " select dp.idproducto as idproducto, round(dp.precio, 2) as preciocostodestino, dp.cantidad as existenciadestino,
           ni.denominacion as productodestino, ni.codigo as codigodestino,
            dpr.dosisunitariadestino as dosisunitariadestino,
            dpr.cantdestino as cantidaddest,dpr.idprodreenvasado as idprodreenvasado,
            round((dp.cantidad * dp.precio),2) as importecostodestino
           from mod_logistica.dat_producto dp
           inner JOIN mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
           inner join mod_logfarmacia.dat_prodreenvasado dpr on dpr.idproddestino = dp.idproducto
           where dp.idestructuracomun = {$this->global->Estructura->idestructura} $condition";
        $conn = Zend_Registry::get('conexion');
        $prod1 = $conn->execute($query1)->fetchAll(PDO::FETCH_ASSOC);
        return $prod1[0];
    }


    public function adicionarProducto($datosDoc, $idDocumento)
    {
        $datprodreenvase = new DatProdreenvase();
        if ($datosDoc['idprodreenvase']) {
            $datprodreenvase->assignIdentifier($datosDoc['idprodreenvase']);
        } else {
            $datprodreenvase->idprodorigen = $datosDoc['idproducto'];
            $datprodreenvase->idreenvase = $idDocumento;
        }
        $datprodreenvase->cantorigen = ($datosDoc['cantidad']) ? $datosDoc['cantidad'] : 0;
        $datprodreenvase->dosisunitaria = ($datosDoc['dosisunitaria']) ? $datosDoc['dosisunitaria'] : 0;
        $datprodreenvase->save();
        return $datprodreenvase;
    }

    public function modificarProductoReenvasado($datosDoc)
    {
        $datprodreenvasado = new DatProdreenvasado();
        $datprodreenvasado->assignIdentifier($datosDoc['idprodreenvasado']);
        $datprodreenvasado->dosisunitariadestino = ($datosDoc['dosisunitariadestino']) ? $datosDoc['dosisunitariadestino'] : 0;
        $datprodreenvasado->save();

        return $datprodreenvasado;
    }


    public function adicionarProdReenvase($datosDoc, $idprodorigen, $reenvasado = false)
    {
        $cantdestino = 0;
        foreach ($datosDoc['arrayLotes'] as &$objLotes) {
            $lotereenvase = new DatLotereenvase();
            if ($objLotes['idlotereenvase']) {
                $lotereenvase->assignIdentifier($objLotes['idlotereenvase']);
                if(!$reenvasado){
                    $this->actualizardisponible($datosDoc, true);
                }
            } else {
                $lotereenvase->idlote = $objLotes['idlote'];
                if(!$reenvasado){
                    $this->actualizardisponible($datosDoc, false);    
                }
            }
         
            if ($reenvasado) {
                $cantdestino += $objLotes['cantrealreenvasada'];
                $lotereenvase->cantdestino = $objLotes['cantdestino'];
                $lotereenvase->cantrealreenvasada = $objLotes['cantrealreenvasada'];
                $lotereenvase->diferencia = $objLotes['diferencia'];
            } else {;
                $lotereenvase->idprodorigen = $idprodorigen;
                $lotereenvase->cantorigen = $objLotes['cantidadorigen'];
                $lotereenvase->dosisunitreal = $objLotes['dosisunitariareal'];
            }
            $lotereenvase->save();
        }

        if ($reenvasado) {
            $datosDoc['cantidad'] = $cantdestino;

            $result = $this->adicionarProductoReenvasado($datosDoc);
            $datosMovimiento = array('iddocumento' => $datosDoc['iddocumento']);
            $datosMovimiento['idproducto'] = $datosDoc['idproductodestino'];
            $datosMovimiento['cantidad'] = $datosDoc['cantidad'];
            $this->actualizarCantProductoreenvasado($datosMovimiento);
        }
        return $result;
    }

    //funcion que actualiza o crea(en caso de que no exista) los lotes comprometidos del producto que se va a reenvasar
    // variable flag determina si se crea o se actualiza un lote comprometido
    public function actualizardisponible($datosDoc, $flag){
        $loteColl = new Doctrine_Collection('DatLoteComprometido');
        foreach($datosDoc['arrayLotes'] as $l) {
            if($flag){
                Doctrine_Query::create()
                ->update('DatLoteComprometido')
                ->set('cantidad',$l['dosisunitariareal'])
                 ->where('iddocumento = ? and idlote = ?', array($datosDoc['iddocumento'], $l['idlote']))
                 ->execute();
            }else{
                $datalotecomprometido =
                 new DatLoteComprometido();
                $datalotecomprometido->idlote = $l['idlote'];
                $datalotecomprometido->iddocumento = $datosDoc['iddocumento'];
                $datalotecomprometido->cantidad = $l['dosisunitariareal'];
                $loteColl->add($datalotecomprometido);
            }
        }
        if (count($loteColl)) {
            $loteColl->save();
        }
    }

    public function actualizarCantProductoreenvasado($datos)
    {
        $objMovimiento = new DatMovimientos();
        if ($datos['iddocumento'] && $datos['idproducto']) {
            $query = Doctrine_Query::create()->select('m.idmovimiento as idmovimiento, m.preciocontable as preciocontable')
                ->from('DatMovimientos m')->where('m.idproducto = ? and m.iddocumento = ?')
                ->fetchOne(array($datos['idproducto'], $datos['iddocumento']));
            $datos['idmovimiento'] = $query->idmovimiento;
            $datos['preciocontable'] = $query->preciocontable;
        }
        $objMovimiento->assignIdentifier($datos['idmovimiento']);
        $objMovimiento['importecontable'] = $datos['preciocontable'] * $datos['cantidad'];
        $objMovimiento['cantidad'] = $datos['cantidad'];
        $objMovimiento->save();
    }

    public function realizarReenvaseProducto($datosDoc)
    {
        $select = " select dlr.idlotereenvase, dlr.idprodorigen, l.idlote,
        (({$datosDoc['dosisunitaria']} * dlr.cantorigen) / {$datosDoc['dosisunitariadestino']}) as cantdestino,
        (floor(dlr.dosisunitreal / {$datosDoc['dosisunitariadestino']})) as cantrealreenvasada,
        (((dlr.dosisunitreal / {$datosDoc['dosisunitariadestino']}) - (floor(dlr.dosisunitreal / {$datosDoc['dosisunitariadestino']}))) * {$datosDoc['dosisunitariadestino']} ) as diferencia,
        (({$datosDoc['dosisunitaria']} * dlr.cantorigen) - dlr.dosisunitreal) as cantdosisunitaria, 
        (SELECT iprod.idproddestino from mod_logfarmacia.dat_prodreenvasado iprod where iprod.idreenvase= {$datosDoc['iddocumento']}) as idproddestino,
        (SELECT l1.idlote from mod_logistica.dat_lote l1
        inner join mod_logfarmacia.dat_prodreenvasado dpro on l1.idproducto = dpro.idproddestino
        where l1.numero = l.numero and dpro.idreenvase = {$datosDoc['iddocumento']}) as idlotedestino
        from mod_logfarmacia.dat_lotereenvase dlr
        inner join mod_logfarmacia.dat_prodreenvase dpr on dpr.idprodorigen = dlr.idprodorigen
        inner join mod_logistica.dat_producto dp on dp.idproducto = dpr.idprodorigen
        inner join mod_logistica.dat_lote l on l.idlote = dlr.idlote
        where dp.idestructuracomun = {$this->global->Estructura->idestructura} and dpr.idreenvase = {$datosDoc['iddocumento']}";
        
        $conn = Zend_Registry::get('conexion');
        $datosDoc['arrayLotes'] = $conn->execute($select)->fetchAll(PDO::FETCH_ASSOC);
        $reenvasado = $this->adicionarProdReenvase($datosDoc, null , true);
        $this->adicionarCantDiferenciaReenvase($datosDoc);
        return array(
            'diferencias' => $this->getDatosDiferencias($datosDoc['iddocumento']),
            'datosReenvasado' => $reenvasado
        );
    }

    public function getDatosDiferencias($iddocumento)
    {
        $clientes = Doctrine_Query::create()->select("dlr.diferencia, round(dr.importecosto, 2) as importecostodif,
        (case when (dlr.diferencia) > 0 then 2 when (dlr.diferencia) < 0 then 1 else 0 end) as diferenciacalc")
            ->from('DatLotereenvase dlr')
            ->innerJoin('dlr.DatProdreenvase dpr ON dpr.idprodorigen = dlr.idprodorigen')
            ->innerJoin('dpr.DatReenvase dr ON dr.idreenvase = dpr.idreenvase')
            ->where('dr.idreenvase = ?', $iddocumento)
            ->fetchArray();
        return $clientes;
    }

    public function getDatosCantidad($iddocumento)
    {
        $clientes = Doctrine_Query::create()->select("sum(dlr.cantrealreenvasada)")
            ->from('DatLotereenvase dlr')
            ->where('dlr.idlotereenvase = ? and dlr.idprodreenvase = ?', array($iddocumento))
            ->fetchArray();
        return $clientes;
    }

    public function adicionarProductoReenvasado($datosDoc)
    {
        $datprodreenvasado = new DatProdreenvasado();
        if ($datosDoc['iddocumento']) {
            $query1 = " select dpr.idprodorigen as idprodorigen
        from mod_logistica.dat_producto dp
        inner join mod_logfarmacia.dat_prodreenvase dpr on dpr.idprodorigen = dp.idproducto
        where dp.idestructuracomun = {$this->global->Estructura->idestructura} and dpr.idreenvase = {$datosDoc['iddocumento']}";
            $conn = Zend_Registry::get('conexion');
            $prod1 = $conn->execute($query1)->fetchAll(PDO::FETCH_ASSOC);
        }

        if (!$datprodreenvasado->existeProdreenvasado($datosDoc['iddocumento'])) {
            $datprodreenvasado->idproddestino = $datosDoc['idproductodestino'];
            $datprodreenvasado->idprodorigen = ($datosDoc['idprodorigen']) ? $datosDoc['idprodorigen'] : $prod1[0]['idprodorigen'];
            $datprodreenvasado->idreenvase = $datosDoc['iddocumento'];
        } else {
            $datprodreenvasado->assignIdentifier($datosDoc['idproductodestino']);
        }
        $datprodreenvasado->cantdestino = ($datosDoc['cantidad']) ? $datosDoc['cantidad'] : 0;
        $datprodreenvasado->save();

        //adicionar movimiento de entrada

        return ($datosDoc['cantidad']) ? $datprodreenvasado->cantdestino : null;
    }

    public function adicionarCantDiferenciaReenvase($datosDoc)
    {
        $datosDoc['preciocosto'] = $datosDoc['preciocosto'] ? $datosDoc['preciocosto'] : 0;
        $datosDoc['precioventa'] =  $datosDoc['precioventa'] ?  $datosDoc['precioventa'] : 0;

        Doctrine_Query::create()
            ->update('DatReenvase')
            ->set('cantdif', "((select sum(({$datosDoc['dosisunitaria']} * dlr.cantorigen) - dlr.dosisunitreal) " .
            "FROM mod_logfarmacia.dat_lotereenvase dlr " . "inner join mod_logfarmacia.dat_prodreenvase dpr on dpr.idprodorigen = dlr.idprodorigen ".
            "inner join mod_logistica.dat_producto dp on dp.idproducto = dpr.idprodorigen ".
            "WHERE dp.idestructuracomun = {$this->global->Estructura->idestructura} and dpr.idreenvase = {$datosDoc['iddocumento']}))")
            ->where('idreenvase = ?', $datosDoc['iddocumento'])
            ->execute();

        Doctrine_Query::create()
            ->update('DatReenvase')
            ->set('importecosto', "((select sum(({$datosDoc['dosisunitaria']} * dlr.cantorigen) - dlr.dosisunitreal) * {$datosDoc['preciocosto']} " .
                "FROM mod_logfarmacia.dat_lotereenvase dlr " . "inner join mod_logfarmacia.dat_prodreenvase dpr on dpr.idprodorigen = dlr.idprodorigen ".
                "inner join mod_logistica.dat_producto dp on dp.idproducto = dpr.idprodorigen ".
                "WHERE dp.idestructuracomun = {$this->global->Estructura->idestructura} and dpr.idreenvase = {$datosDoc['iddocumento']}))")
            ->set('importeventa', "((select sum(({$datosDoc['dosisunitaria']} * dlr.cantorigen) - dlr.dosisunitreal) * {$datosDoc['precioventa']} " .
                "FROM mod_logfarmacia.dat_lotereenvase dlr " . "inner join mod_logfarmacia.dat_prodreenvase dpr on dpr.idprodorigen = dlr.idprodorigen ".
                "inner join mod_logistica.dat_producto dp on dp.idproducto = dpr.idprodorigen ".
                "WHERE dp.idestructuracomun = {$this->global->Estructura->idestructura} and dpr.idreenvase = {$datosDoc['iddocumento']}))")
            ->where('idreenvase = ?', $datosDoc['iddocumento'])
            ->execute();
    }

    public function eliminarDocumento($iddocumento)
    {
        return parent::eliminarDocumento($iddocumento[0]);
    }

    public function eliminarLotes($datosDoc)
    {
        if ($datosDoc['idlotes']) {
            Doctrine_Query::create()
                ->delete('DatLotereenvase')
                ->whereIn('idlotereenvase', $datosDoc['idlotes'])
                ->execute();
        }
        return array('success' => true);
    }

    public function eliminarProducto($datosDoc)
    {
        if ($datosDoc['iddocumento'] && $datosDoc['datos']['origen'] == 1) {
           Doctrine_Query::create()->delete('DatProdreenvase')->where('idreenvase = ?', array($datosDoc['iddocumento']))->execute();
        }
        if ($datosDoc['iddocumento'] && $datosDoc['datos']['destino'] == 1) {

            $objProdReenvasado = Doctrine::getTable('DatProdreenvasado')->findByDql('idreenvase = ?', array($datosDoc['iddocumento']))->toArray();

            $idprodreenvase = $objProdReenvasado[0]['idprodorigen'];

            Doctrine_Query::create()->delete('DatProdreenvasado')->where('idreenvase = ?', array($datosDoc['iddocumento']))->execute();

            Doctrine_Query::create()
                ->update('DatLotereenvase')
                ->set('cantdestino', 0)
                ->set('cantrealreenvasada', 0)
                ->set('diferencia', 0)
                ->where('idprodorigen = ?', array($idprodreenvase))
                ->execute();

            $this->getProductoModel()->eliminarMovimientos($datosDoc['iddocumento'], $datosDoc, false, false);
        }
        if ($datosDoc['iddocumento']) {
           Doctrine_Query::create()
               ->update('DatReenvase')
               ->set('cantdif', 0)
               ->set('importecosto', 0)
               ->set('importeventa', 0)
               ->where('idreenvase = ?', array($datosDoc['iddocumento']))
               ->execute();
       }
        return array('success' => true);
    }

    public function aprobarDocumento($datosDoc)
    {
        $cronologia = parent::aprobarDocumento($datosDoc['iddocumento'], true);
        $this->_loteService->actualizarExistenciaLote($datosDoc['iddocumento'], true, $cronologia);
        Doctrine_Query::create()->update('DatDocumento')->set('idcomprobante', -1)
            ->where('iddocumento = ?', array($datosDoc['iddocumento']))->execute();
        return true;
    }

    protected function actualizarUbicacion($iddocumento, $ubicar = false)
    {
        Doctrine_Query::create()
            ->delete('DatMovubicacion')
            ->where(
                'cantidad = 0 AND idmovimiento IN (SELECT m.idmovimiento FROM DatMovimientos m '
                . 'WHERE m.iddocumento = ?)', $iddocumento
            )
            ->execute();
        $query = Doctrine_Query::create()
            ->select('m.idproducto AS idproducto, mu.idestructuraubicacion AS idubicacion, mu.cantidad')
            ->from('DatMovubicacion mu')->innerJoin('mu.DatMovimientos m')
            ->where('m.iddocumento = ?', $iddocumento);
        if ($ubicar) {
            $ubicaciones = $query->fetchArray();
            foreach ($ubicaciones as $value) {
                $this->_ubicacionService->ubicarProducto($value);
            }
        } else {
            $query->addSelect('ap.idareaproducto AS idareaproducto, up.idubicacionproducto AS idubicacionproducto')
                ->innerJoin('mu.DatEstructuraubicacion eu')->innerJoin('eu.DatUbicacionproducto up')
                ->innerJoin('eu.DatArea a')->innerJoin('a.DatAreaproducto ap')
                ->addWhere('m.idproducto = up.idproducto AND up.idproducto = ap.idproducto');
            $ubicaciones = $query->fetchArray();
            $this->_ubicacionService->desubicarProducto($ubicaciones);
        }
        return true;
    }
}