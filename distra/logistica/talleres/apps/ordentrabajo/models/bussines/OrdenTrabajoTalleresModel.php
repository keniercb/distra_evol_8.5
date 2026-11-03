<?php

/**
 * @class     OrdenTrabajoTalleresModel
 * @package   Talleres
 * @author    Daniel Arias Espinosa
 * @copyright XETID
 * @version   1.0
 */
class OrdenTrabajoTalleresModel extends DocumentoLogisticaModel
{
    private $_serviciosRecursosHumanos, $_serviciosPlanificacion, $_serviciosConfiguracionGeneral,
        $_serviciosEstructuraComp, $_ppaService, $_aperturaAFT, $_aperturaFAC, $_utilesServices,
        $_solicitudServices, $_docAFTServices, $_maestro, $_citasServices, $_vgoperariosvarios;

    public function __construct($datosDoc = array(), $aperturaAFT = false)
    {
        $datosDoc['subsistema'] = LogisticaGlobal::SUBSISTEMA_TALLERES;
        parent::__construct($datosDoc);
        $this->_maestro = new MaestroProductoModel();
        $this->_aperturaFAC = ($datosDoc['aperturadoFAC']) ? $datosDoc['aperturadoFAC'] : false;
        $this->_vgoperariosvarios = ($datosDoc['vgoperariosvarios']) ? $datosDoc['vgoperariosvarios'] : false;
        $this->idestructuracomun = $this->global->Estructura->idestructura;
        $this->_solicitudServices = new SolicitudService();
        $this->_citasServices = new CitasTalleresService();
        $relations[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatOrdenTrabajo',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'idordentrabajo',
            ),
        );
        $relations[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatPlansolicitud',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'idplansolicitud',
            ),
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatDocumento(), $relations);
        $relationsInd[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatPiezaRecuperable',
            'properties' => array('local' => 'idindicador', 'foreign' => 'idindicador'),
        );
        $relationsInd[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatMaterial',
            'properties' => array('local' => 'idindicador', 'foreign' => 'idindicador'),
        );

        $relationsAct[] = array(
            'cardinalidad' => 'many', 'relation' => 'ConfActividad',
            'properties' => array('local' => 'idactividad', 'foreign' => 'idactividad',
            ),
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatActividadOrden(), $relations);

        $relationsResponsableactividad[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatResponsableactividad',
            'properties' => array('local' => 'idordenactividad', 'foreign' => 'idordenactividad',
            ),
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatActividadOrden(), $relationsResponsableactividad);

        $this->_aperturaAFT = $aperturaAFT;
        $this->doctrineHelper->tryInyectRelactions(new NomIndicador, $relationsInd);
        if (class_exists('DatPedido')) {
            $relationsPed[] = array(
                'cardinalidad' => 'one', 'relation' => 'DatPedidoOrdenTrabajo',
                'properties' => array('local' => 'iddocumento', 'foreign' => 'idpedido'),
            );
            $this->doctrineHelper->tryInyectRelactions(new DatPedido, $relationsPed);
        }
        $relations[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatDocumentocl',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'iddocumento',
            ),
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatDocumento(), $relations);
        $this->_serviciosRecursosHumanos = ServiciosRecursosHumanosHelper::__init();
        $this->_serviciosPlanificacion = ServiciosPlanificacionHelper::__init();
        $this->_serviciosConfiguracionGeneral = ServiciosConfiguracionGeneralHelper::__init();
        $this->_serviciosEstructuraComp = ServiciosEstructuraComposicionHelper::__init();
        if ($aperturaAFT) {
            $this->_ppaService = new ParetesPiezasAgregadosService();
            $this->_utilesServices = $this->_solicitudServices->getUtilesServices();
            $this->_docAFTServices = $this->_solicitudServices->getDocAFTServices();
            $relationsRegNumAct[] = array(
                'cardinalidad' => 'one', 'relation' => 'DatRegnumericoActivo', 'properties' => array(
                    'local' => 'idproducto', 'foreign' => 'idregnumerico',
                ),
            );
            $this->doctrineHelper->tryInyectRelactions(new DatMedio, $relationsRegNumAct);

            $relationsDatProd[] = array(
                'cardinalidad' => 'one', 'relation' => 'CfgPlanificacionMantenimiento', 'properties' => array(
                    'local' => 'idindicador', 'foreign' => 'idindicador',
                ),
            );
            $this->doctrineHelper->tryInyectRelactions(new DatProductoLogistica, $relationsDatProd);

            $relationsCfgPlanificacionMantenimiento[] = array(
                'cardinalidad' => 'one', 'relation' => 'DatMedio', 'properties' => array(
                    'local' => 'idindicador', 'foreign' => 'idindicador',
                ),
            );
            $this->doctrineHelper->tryInyectRelactions(new CfgPlanificacionMantenimiento, $relationsCfgPlanificacionMantenimiento);
        }
    }

    /**
     * @method devuelve un array o el DQL de las Ordenes de Trabajo.
     * @param array $parametros
     * @param bool $dqlResult
     *
     * @return array|Doctrine_Query
     */
    public function devolverOrdenesTrabajo($parametros = array(), $dqlResult = false)
    {
        $conf = LogisticaDoctrineHelper::__init()->getConnection()->execute(
            "select ct.centrocostosporactividad from mod_logtaller.conf_talleres ct where ct.idestructuracomun = {$this->idestructuracomun}"
        )->fetchAll(PDO::FETCH_ASSOC);
        $aux = "";
        if ($parametros['iddeposito']) {
            $aux = "and mat.iddeposito = {$parametros['iddeposito']} ";
        }
        $subQueryMat = "(SELECT count(mat.idmaterial)
            FROM DatMaterial mat WHERE mat.idordentrabajo = ord.idordentrabajo and mat.cantidad > mat.cantidadreal
            " . $aux . ")
            as cant_productos, 
            (SELECT count(matp.idmaterial) 
            FROM DatMaterial matp WHERE matp.idordentrabajo = ord.idordentrabajo  
            ) as productos";
        $subQueryMatSumCantReal = "(SELECT COALESCE(sum(mat1.cantidadreal), 0) FROM DatMaterial mat1 WHERE mat1.idordentrabajo = ord.idordentrabajo) as totalcantidadreal";
        $subQueryActv = "(SELECT count(act.idordenactividad)
            FROM DatActividadOrden act WHERE act.idordentrabajo = ord.idordentrabajo) as cantactvidades";
        $subQueryDatosActv = "(SELECT count(actv.idordenactividad)
            FROM DatActividadOrden actv WHERE actv.idordentrabajo = ord.idordentrabajo
            and ( actv.tiemporeal is null or   actv.idresponsable is null) )
            as existeactvidadsindatos";
        //Pa que no sea obligatorio registrar la solucion para cerrar la OT
        $subQuerySolucion = " 1 as solucion";
        //$subQuerySolucion = "(SELECT count(solucion.idsolucionordentrabajo)
        //FROM DatSolucionOrdenTrabajo solucion WHERE solucion.idordentrabajo = ord.idordentrabajo) as solucion";
        $subNroDocOrigen = "(SELECT do.nrodoc FROM DatDocumento do WHERE do.iddocumento = ord.iddocumentoorigen)
            as nrodocorigen";
        $subEntidadSolTerc = "(SELECT psol.idestructura FROM DatPlansolicitud psol
              WHERE psol.idplansolicitud = ord.iddocumentoorigen  and 3 = ord.documentoorigen
              and psol.idestructura is not null ) as idestructurasolicitudterceros";
        $importecup = "coalesce(ROUND(coalesce((SELECT ROUND(SUM(coalesce(rd.costo,0)),2) FROM DatActividadOrden rd
                        WHERE rd.idordentrabajo = ord.idordentrabajo),0) +
                        coalesce((SELECT ROUND(SUM(coalesce(dm.importecup,0)),2) FROM DatMaterial dm
                        WHERE dm.idordentrabajo = ord.idordentrabajo),0),2),0)";
        $importecuc = "coalesce(ROUND(coalesce((SELECT ROUND(SUM(coalesce(rdd.importealternativo,0)),2) FROM DatActividadOrden rdd
                        WHERE rdd.idordentrabajo = ord.idordentrabajo),0) +
                        coalesce((SELECT ROUND(SUM(coalesce(dmm.importecuc,0)),2) FROM DatMaterial dmm
                        WHERE dmm.idordentrabajo = ord.idordentrabajo),0),2),0)";

        $selectOrden = "ord.idordentrabajo as idordentrabajo, ord.fechainicio as fechainicio, ord.fechafin as fechafin,
            ord.dictamentecnico as dictamentecnico, ord.garantia as garantia, ord.fechacierre as fechacierre,
            ord.fallascliente as fallascliente, ord.iddocumentoorigen as iddocumentoorigen,
            ord.documentoorigen as documentoorigen, ord.idtecnico as idtecnico, ord.idtipopreciomat as idtipopreciomat,
            ord.idplanificacionmantenimiento as idplanificacionmantenimiento,
            ord.cantidadreclamaciones as cantidadreclamaciones, ord.idagencia as idagencia,
            ord.atributoidentificador as atributoidentificador, ord.cerradopor as cerradopor,
            ord.correocliente as correocliente,ord.telefono as telefono,ord.nombreresponsable as nombreresponsable,ord.idcarnetresponsable as idcarnetresponsable,
            ord.telefonoresponsable as telefonoresponsable,ord.textocorreoresponsable as textocorreoresponsable,
            (SELECT ts.idservicio FROM DatTrabajoServicio ts WHERE ts.idordentrabajo = ord.idordentrabajo LIMIT 1) as idservicio,
            (SELECT confAct.denominacion FROM ConfActividad confAct WHERE confAct.idactividad = (SELECT ts1.idservicio FROM DatTrabajoServicio ts1 WHERE ts1.idordentrabajo = ord.idordentrabajo LIMIT 1) limit 1) as servicio,
            ord.estadoorden as estadoorden,ord.tipo as tipo,
            med.idmedio as idmedio, med.idindicador as idindicador, rec.descripcion as descripcionreclamacion,
            med.idproducto as idproducto, med.idpadre as idpadreindicador, ind.denominacion as producto,
            ord.idtipoprecio as idtipoprecio,{$subNroDocOrigen}, {$subQueryMat}, {$subQueryActv},
             {$subQueryDatosActv}, {$subQuerySolucion},{$subQueryMatSumCantReal}";
        $parametros['idestructura'] = ($parametros['idestructura']) ? $parametros['idestructura'] : $this->idestructuracomun;
        if ($parametros['idcentrocosto']) {
            $parametros['idcliente'] = $parametros['idcentrocosto'];
            $parametros['tipocliente'] = LogisticaGlobal::TIPO_CLIENTE_CENTRO;
        }
        //$idestados = $parametros['estado'];
        if ($parametros['estado']) {
            $parametros['estado'] = explode(',', $parametros['estado']);
        }
        //unset($parametros['estado']);
        $parametros['clienteorden'] = 1;
        $dql = parent::devolverDocumentos($parametros);
        $dql->addSelect(
            "(SELECT COUNT(iddocumento) FROM DatDocumentoPadre ddp 
            WHERE ddp.idpadre = d.iddocumento) as hijos"
        );
        if (count($conf) && $conf[0]['centrocostosporactividad']) {
            $relations[] = array(
                'cardinalidad' => 'one', 'relation' => 'DatActividadOrden',
                'properties' => array('local' => 'idactividad', 'foreign' => 'idactividad'),
            );
            $this->doctrineHelper->tryInyectRelactions(new DatMaterial, $relations);
            $dql->addSelect(
                "(SELECT ARRAY_TO_STRING(ARRAY_AGG(DISTINCT oac.idcentrodecosto),',') FROM DatActividadOrden oac
                WHERE oac.idordentrabajo = d.iddocumento) as idcentrocosto"
            );

            $dql->addSelect(
                "(SELECT ARRAY_TO_STRING(ARRAY_AGG(DISTINCT actm.idordenactividad),',') FROM DatMaterial mact
                INNER JOIN mact.DatActividadOrden actm ON mact.idactividad = actm.idactividad
                WHERE actm.idordentrabajo = d.iddocumento AND mact.cantidad > mact.cantidadreal) as idordenactividad"
            );
        } else {
            $dql->addSelect(
                "(SELECT cc.idcliente FROM DatDocumentoCliente cc " .
                "WHERE cc.iddocumento = d.iddocumento and cc.tipocliente = 2 LIMIT 1) as idcentrocosto"
            );
            $dql->addSelect(
                "1 as devolvercentrocosto"
            );
        }
        $dql->addSelect(
            "d.idcomprobante"
        );
        $dql->addSelect(
            "(SELECT ddo.observaciones FROM DatDocObservaciones ddo WHERE ddo.iddocumento = d.iddocumento) as otobservacion"
        );
        /*$dql->addSelect(
            "ddo.observaciones as otobservacion"
        );*/
        // $relations[] = array(
        //     'cardinalidad' => 'one', 'relation' => 'DatOrdenTrabajo',
        //     'properties' => array('local' => 'idordentrabajo', 'foreign' => 'idordentrabajo'),
        // );
        // $this->doctrineHelper->tryInyectRelactions(new DatUbicaciontallorden, $relations);
        $dql->addSelect(
            "(SELECT nu.denominacion from NomUbicaciontall nu where nu.idubicaciontall = ord.ubicacionactual) as ubicaciontall"
        );
        /*$dql->addSelect(
        "(SELECT cc1.idcliente FROM DatDocumentoCliente cc1 " .
        "WHERE cc1.iddocumento = d.iddocumento and cc1.tipocliente = 1 LIMIT 1) as idcliente"
        );*/
        $dql->innerJoin('d.DatOrdenTrabajo ord')->addSelect($selectOrden/*,$selecServicios*/)
            ->innerJoin('ord.DatMedio med')->innerJoin('med.NomIndicador ind')//->leftJoin("ord.DatSolucionOrdenTrabajo dso ")
            //->leftJoin('ord.DatTrabajoServicio ts')->leftJoin("ts.ConfActividad confAct")
            //->leftJoin("ord.DatMaterial dmat")
            ->leftJoin('ord.DatOrdenReclamacion rec')
            ->innerJoin('ind.NomIndicadorhoja indh')/*->leftJoin('ord.DatDocObservaciones ddo')
            ->leftJoin('ord.DatUbicaciontallorden duto')
            ->leftJoin('duto.NomUbicaciontall nut')*/
        ;

        $dql->addSelect("{$importecup} as importetotal,{$importecuc} as importealternativo");
        //echo $dql->getSqlQuery();die;
        $this->_maestro->addQueryJoinMarcaModelo($dql, 'indh', 'nmar', 'nm', true, true, 'ind');
        $this->filtrosAuxialiares($dql, $parametros);

        if ($parametros['cliente']) {
            $dql->addWhere("ord.idcliente = ? ", array($parametros['cliente']));
        };
        /*if ($idestados) {
        $dql->addWhere("d.estado IN ({$idestados})");
        };*/
        if ($parametros['iddocumentoorigen']) {
            $parametros['iddocumentoorigen'] =
                (!is_array($parametros['iddocumentoorigen'])) ? array($parametros['iddocumentoorigen']) :
                    $parametros['iddocumentoorigen'];
            $dql->andWhereIn("ord.iddocumentoorigen ", $parametros['iddocumentoorigen']);
        };
        if ($parametros['atributoidentificador']) {
            $dql->addWhere("ord.atributoidentificador ilike '%" . $parametros['atributoidentificador'] . "%'");
        };
        $this->logisticaDoctrine->addQueryLimits($dql, $parametros);
        $usuario = $this->cargaInicial();
        //print_r(array($dql->getSqlQuery(),$dql->getParams()));die;
        if ($dqlResult) {
            return $dql;
        } else {
            $result = $dql->fetchArray();
            //if ($parametros['recsolicitudservicio']) {
            //$result = $this->mostrarEntidadEnLasOrdenes($result, $parametros);
            //}
            $this->cargarClientesDocumentos($result);
            return array('cantidad' => $dql->count(), 'datos' => $result, 'usuarios' => $usuario['usuarios']);
        }
    }

    private function mostrarEntidadEnLasOrdenes($datos, $parametros)
    {
        $conn = Zend_Registry::get('conexion');

        $cacheClientes = array();
        $cacheAgencia = array();
        foreach ($datos as $i => $row) {
            $devuelto = LogisticaDoctrineHelper::__init()->getConnection()->execute("select sum(round(dgm.cantidad*dgm.precioalternativo,2)) as devueltocuc,
            sum(round(dgm.cantidad*dgm.preciocontable,2)) as devueltocup
            from mod_logistica.dat_documento dg
            inner join mod_logistica.dat_movimiento dgm on dgm.iddocumento = dg.iddocumento
            inner join mod_logistica.dat_documentopadre dgp on dgp.iddocumento = dg.iddocumento
            inner join mod_logistica.dat_documentopadre dgpp on dgpp.iddocumento = dgp.idpadre
            where  dgpp.idpadre = {$row['iddocumento']}")->fetchAll(PDO::FETCH_ASSOC);

            $entregado = LogisticaDoctrineHelper::__init()->getConnection()->execute("select sum(round(dgm.cantidad*dgm.precioalternativo,2)) as devueltocuc,
            sum(round(dgm.cantidad*dgm.preciocontable,2)) as devueltocup
            from mod_logistica.dat_documento dg
            inner join mod_logistica.dat_movimiento dgm on dgm.iddocumento = dg.iddocumento
            inner join mod_logistica.dat_documentopadre dgp on dgp.iddocumento = dg.iddocumento
            where dgp.idpadre = {$row['iddocumento']}")->fetchAll(PDO::FETCH_ASSOC);

            $actividades = LogisticaDoctrineHelper::__init()->getConnection()->execute(
                "select  sum(round(da.costo,2)) as importecup, sum(round(da.importealternativo,2)) as importecuc
                 from  mod_logtaller.dat_ordenactividad da where da.idordentrabajo = {$row['iddocumento']}")->fetchAll(PDO::FETCH_ASSOC);

            $datos[$i]['importetotal'] = $entregado[0]['devueltocup'] + $actividades[0]['importecup'] - $devuelto[0]['devueltocup'];
            $datos[$i]['importealternativo'] = $entregado[0]['devueltocuc'] + $actividades[0]['importecuc'] - $devuelto[0]['devueltocuc'];

        }
        return $datos;
    }

    /**
     * @method Filtrar
     * @param $dql
     * @param $parametros
     *
     * @return Doctrine_Query
     */
    private function filtrosAuxialiares(Doctrine_Query $dql, $parametros)
    {
        if ($parametros['garantia']) {
            $parametros['garantia'] = ($parametros['garantia'] == 1 ? 0 : 1);
            $dql->addWhere("ord.garantia = ?", array($parametros['garantia']));
        };

        if ($parametros['ubicaciones']) {
            // $dql->addWhere("ord.ubicacionactual in (?)", array($parametros['ubicaciones']));
            $dql->addWhere("ord.ubicacionactual in ({$parametros['ubicaciones']})");
        }

        if ($parametros['fechainiciocomienzo']) {
            $dql->addWhere("ord.fechainicio >= ?", array($parametros['fechainiciocomienzo']));
        };
        if ($parametros['fechafincomienzo']) {
            $dql->addWhere("ord.fechainicio <= ?", array($parametros['fechafincomienzo']));
        };
        if ($parametros['fechainiciocierre']) {
            $dql->addWhere("ord.fechacierre >= ?", array($parametros['fechainiciocierre']));
        };
        if ($parametros['fechafincierre']) {
            $dql->addWhere("ord.fechacierre <= ?", array($parametros['fechafincierre']));
        };

        if ($parametros['idindicador']) {
            if (is_array($parametros['idindicador'])) {
                $dql->andWhereIn("med.idindicador ", $parametros['idindicador']);
            } else {
                $dql->addWhere("med.idindicador = ? ", array($parametros['idindicador']));
            }
        };
        if ($parametros['idproducto']) { //id del registro numerico
            $dql->addWhere("med.idproducto = ? ", array($parametros['idproducto']));
        };
        if ($parametros['idservicio']) {
            /*if (!is_array($parametros['idservicio'])) {
            $idservicio = array($parametros['idservicio']);
            }*/
            $dql->addWhere("ord.idordentrabajo IN (SELECT dts.idordentrabajo FROM DatTrabajoServicio dts WHERE dts.idservicio IN ({$parametros['idservicio']}))");

        };
        if ($parametros['documentoorigen']) {
            $parametros['documentoorigen'] =
                ($parametros['documentoorigen'] == 100) ? 0 : $parametros['documentoorigen'];
            $parametros['documentoorigen'] =
                (!is_array($parametros['documentoorigen'])) ? array($parametros['documentoorigen']) :
                    $parametros['documentoorigen'];
            $dql->andWhereIn("ord.documentoorigen ", $parametros['documentoorigen']);
        };
        if ($parametros['excluirdocumentoorigen']) {
            $parametros['excluirdocumentoorigen'] =
                ($parametros['excluirdocumentoorigen'] == 100) ? 0 : $parametros['excluirdocumentoorigen'];
            $parametros['excluirdocumentoorigen'] =
                (!is_array($parametros['excluirdocumentoorigen'])) ? array($parametros['excluirdocumentoorigen']) :
                    $parametros['excluirdocumentoorigen'];
            $dql->andWhereNotIn("ord.documentoorigen ", $parametros['excluirdocumentoorigen']);
        };
        if ($parametros['denominacionprod']) {
            $dql->addWhere("ind.denominacion ilike '%" . $parametros['denominacionprod'] . "%'");
        };
        if ($parametros['garantia']) {
            $dql->addWhere("ord.garantia = ?", array($parametros['garantia']));
        };
        if ($parametros['estadoorden']) {
            $dql->addWhere("ord.estadoorden = ?", array($parametros['estadoorden']));
        };
        if ($parametros['filterestado']) {
            $dql->addWhere("d.estado in ?", array($parametros['filterestado']));
        };
        if ($parametros['iddocumento']) {
            $dql->addWhere("ord.idordentrabajo = ?", array($parametros['iddocumento']));
        };
        if ($parametros['vales']) {
            $ids = $this->cargarOrdenesPendientesConMaterialesListos($parametros);
            if ($ids) {
                $dql->andWhereNotIn("ord.idordentrabajo ", $ids);
            }
        };
        if ($parametros['iddeposito']) {
            $dql->andWhere("(SELECT COUNT(mmat.idmaterial) FROM DatMaterial mmat WHERE mmat.iddeposito = ? AND mmat.idordentrabajo = ord.idordentrabajo) > 0", array($parametros['iddeposito']));
            //$dql->andWhere("dmat.iddeposito = ? ", array($parametros['iddeposito']));
        }
        if ($parametros['orderby']) {
            $dql->orderBy("d.{$parametros['orderby']}");
        }
        //        if ($parametros['idindicadorpiezafaltante']) {
        //            $dql->innerJoin('ord.DatMaterial mat')
        //            ->addWhere("mat.estado = 1") ->addWhere("mat.idindicador = ?", array('idindicadorpiezafaltante'));
        //        };
        if ($parametros['idarea']) {
            $dql->addWhere("ord.idordentrabajo IN (
                SELECT DISTINCT dao.idordentrabajo
                FROM DatActividadOrden dao
                WHERE dao.idarea IN ({$parametros['idarea']})
            )");

        }
        return $dql;
    }

    /**
     * Duplica el documento seleccionado.
     * @param numeric $iddocumento Indentificador del documento.
     * @return Integer
     */
    public function copiarDocumento($iddocumento, $idcliente, $idtipoprecio, $idtipopreciomat, $sameDoc = false, $cancelSigno = false)
    {

        $idCopia = parent::copiarDocumento($iddocumento, $sameDoc, $cancelSigno);
        $docOrdentrabajo = Doctrine::getTable('DatOrdenTrabajo')->find($iddocumento);
        $ordenTrabajo = $docOrdentrabajo->copy();
        $datos = $docOrdentrabajo->toArray();
        $datos['idordentrabajo'] = $idCopia;
        $datos['iddocumento'] = $idCopia;
        $datos['fechacierre'] = null;
        $datos['idcliente'] = $idcliente;
        $datos['idtipoprecio'] = $idtipoprecio;
        $datos['idtipopreciomat'] = $idtipopreciomat;
        $ordenTrabajo->synchronizeWithArray($datos);
        $ordenTrabajo->save();
        //Trabajo Servicio
        $datosTrabajoServicio = $this->selectDatTrabajoServicio($iddocumento);
        foreach ($datosTrabajoServicio as $dts) {
            $idordentrabajo = $dts['idordentrabajo'] = $idCopia;
            $idtrabajoservicio = $dts['idtrabajoservicio'];
            unset($idtrabajoservicio);
            $idservicio = $dts['idservicio'];
            $sql = "INSERT INTO mod_logtaller.dat_trabajoservicio(idservicio,idordentrabajo)
                      VALUES ($idservicio,$idordentrabajo)";
            $this->doctrineHelper->getConnection()->fetchArray($sql);
        }
        //Centro costo

//Actividades Orden
        $arrDatActividadOrden = new Doctrine_Collection('DatActividadOrden');
        $datActividadOrden = $this->devolverDatActividadOrden($iddocumento);
        $actord = array();

        foreach ($datActividadOrden as $dao) {
            //$idactividad = $dao['idactividad'];
            $objActividadOrden = new DatActividadOrden();
            //$idordenactividad = $dao['idordenactividad'];
            unset($dao['idordenactividad']);
            $dao['idordentrabajo'] = $idCopia;
            $objActividadOrden->synchronizeWithArray($dao);
            $arrDatActividadOrden->add($objActividadOrden);
            //$actord = $dao;
        }
        if ($arrDatActividadOrden->count()) {
            $arrDatActividadOrden->save();
        }
        //if (is_array($actord) && !empty($actord)) {
        //$objActividadOrden->synchronizeWithArray($actord);
        //$arrDatActividadOrden = $objActividadOrden;
        //Responsable Actividad
        //$copiadatActividadOrden = $this->devolverDatActividadOrden($idCopia);
        //$copiaIdordenactividad = $copiadatActividadOrden[0]['idordenactividad'];
        //$copiaIdactividad = $copiadatActividadOrden[0]['idactividad'];
        /*$datResponsableactividad = $this->devolverDatResponsableactividad($idactividad);
        foreach ($datResponsableactividad as $dar) {
        $idordenactividad = ($copiaIdordenactividad) ? $copiaIdordenactividad : null;
        $idactividad = ($copiaIdactividad) ? $copiaIdactividad : null;
        $idresponsable = ($dar['idresponsable']) ? $dar['idresponsable'] : null;
        $hora = ($dar['hora']) ? $dar['hora'] : null;
        $salarioporhoras = ($dar['salarioporhoras']) ? $dar['salarioporhoras'] : null;
        $nopagar = ($dar['nopagar'] == 1) ? 1 : 0;
        $fecha = ($dar['fecha']) ? $dar['fecha'] : null;
        $motivo = ($dar['motivo']) ? $dar['motivo'] : null;
        $idusuario = ($dar['idusuario']) ? $dar['idusuario'] : null;

        $sql = "INSERT INTO mod_logtaller.dat_responsableactividad
        (idordenactividad,idactividad,idresponsable,hora,salarioporhoras,fecha,nopagar,motivo,idusuario)
        VALUES ({$idordenactividad},{$idactividad},{$idresponsable},{$hora},{$salarioporhoras},'{$fecha}','{$nopagar}','{$motivo}',{$idusuario})
        ";
        $this->doctrineHelper->getConnection()->execute($sql);
        }*/
        //}

        //Materiales Orden
        $arrDatMaterial = new Doctrine_Collection('DatMaterial');
        $datMaterialesOrden = $this->devolverDatMaterialesOrden($iddocumento);
        foreach ($datMaterialesOrden as $dmo) {
            $objMaterialOrden = new DatMaterial();
            //$idmaterial = $dmo['idmaterial'];
            unset($dmo['idmaterial']);
            unset($dmo['nrosvales']);
            $dmo['idordentrabajo'] = $idCopia;
            //if (is_array($dmo)) {
            $objMaterialOrden->synchronizeWithArray($dmo);
            //}
            $arrDatMaterial->add($objMaterialOrden);
        }
        if ($arrDatMaterial->count()) {
            $arrDatMaterial->save();
        }

        //Medio de la Orden
        $arrDatMedio = new Doctrine_Collection('DatMedio');
        $datMedioOrden = $this->devolverDatMedioOrden($iddocumento);
        foreach ($datMedioOrden as $dmo) {
            $objMedioOrden = new DatMedio();
            unset($dmo['idmedio']);
            $dmo['idordentrabajo'] = $idCopia;
            //if (is_array($dmo)) {
            $objMedioOrden->synchronizeWithArray($dmo);
            //}
            $arrDatMedio->add($objMedioOrden);
        }
        if ($arrDatMedio->count()) {
            $arrDatMedio->save();
        }

        // Fallas Medio Orden
        /*$arrDatFallasOrden = new Doctrine_Collection('DatFallasOrdenTrabajo');
        $datFallasOrden = $this->devolverDatFallasOrdenTrabajo($iddocumento);
        foreach ($datFallasOrden as $dfo) {
        $objFallasOrden = new DatFallasOrdenTrabajo();
        $idfallasordentrabajo = $dmo['idfallasordentrabajo'];
        unset($idfallasordentrabajo);
        $dmo['idordentrabajo'] = $idCopia;
        if (is_array($dfo)) {
        $objFallasOrden->synchronizeWithArray($dfo);
        }
        $arrDatFallasOrden = $objFallasOrden;
        }
        if ($arrDatFallasOrden->count()) {
        $arrDatFallasOrden->save();
        }*/

        // Orden Reclamacion
        /*$arrDatOrdenReclamacion = new Doctrine_Collection('DatOrdenReclamacion');
        $datOrdenReclamacion = $this->devolverDatOrdenReclamacion($iddocumento);
        foreach ($datOrdenReclamacion as $dor) {
        $objOrdenReclamacion = new DatOrdenReclamacion();
        $idordenreclamacion = $dor['idordenreclamacion'];
        unset($idordenreclamacion);
        $dor['idordentrabajo'] = $idCopia;
        if (is_array($dor)) {
        $objOrdenReclamacion->synchronizeWithArray($dor);
        }
        $arrDatOrdenReclamacion = $objOrdenReclamacion;
        }
        if ($arrDatOrdenReclamacion->count()) {
        $arrDatOrdenReclamacion->save();
        }*/
//Solucion de la Orden
        /*$arrDatSolucionOrdenTrabajo = new Doctrine_Collection('DatSolucionOrdenTrabajo');
        $datSolucionOrdenTrabajo = $this->devolverDatSolucionOrdenTrabajo($iddocumento);
        foreach ($datSolucionOrdenTrabajo as $dsot) {
        $objSolucionOrdenTrabajo = new DatSolucionOrdenTrabajo();
        $idsolucionordentrabajo = $dsot['idsolucionordentrabajo'];
        unset($idsolucionordentrabajo);
        $dsot['idordentrabajo'] = $idCopia;
        if (is_array($dsot)) {
        $objSolucionOrdenTrabajo->synchronizeWithArray($dsot);
        }
        $arrDatSolucionOrdenTrabajo = $objSolucionOrdenTrabajo;
        }
        if ($arrDatSolucionOrdenTrabajo->count()) {
        $arrDatSolucionOrdenTrabajo->save();
        }*/

//Clientes de la Orden
        $cliente = Doctrine::getTable('DatDocumentoCliente')->findByDql('iddocumento = ?', array($iddocumento));
        if ($cliente) {
            $arrDatDocumentoCliente = new Doctrine_Collection('DatDocumentoCliente');
            foreach ($cliente as $cl) {
                $objDatDocumentoCliente = new DatDocumentoCliente();
                $cl['iddocumentocliente'] = null;
                $cl['iddocumento'] = $idCopia;
                //if (is_array($dmo)) {
                $objDatDocumentoCliente->synchronizeWithArray($cl);
                //}
                $arrDatDocumentoCliente->add($objDatDocumentoCliente);
            }
            if ($arrDatDocumentoCliente->count()) {
                $arrDatDocumentoCliente->save();
            }
        }

        /*$padre = Doctrine::getTable('DatDocumentoPadre')->findByDql('iddocumento = ?', array($iddocumento))
        ->getFirst();
        if ($padre) {
        $newpadre = $padre->copy();
        $datos = $padre->toArray();
        $datos['iddocumentopadre'] = null;
        $datos['iddocumento'] = $idCopia;
        $newpadre->synchronizeWithArray($datos);
        $newpadre->save();
        }*/
        $doc = Doctrine::getTable('DatDocumento')->find($idCopia);
        return array('iddocumento' => $idCopia, 'observaciones' => $doc->observaciones);
    }

    public function selectDatTrabajoServicio($iddocumento)
    {
        $query = Doctrine_Query::create();
        return $query->select("*")
            ->from('DatTrabajoServicio')
            ->where('idordentrabajo=?', $iddocumento)
            ->fetchArray();
    }

    public function selectCentrocosto($iddocumento)
    {
        /*$result = $this->contabilidadHelper->obtenerCentrosCostoFiltro(
        $this->global->Estructura->idestructura, 0, 1000,
        $this->uiParams['criterio']
        );*/

        $query = Doctrine_Query::create();
        return $query->select('cc.idcliente')
            ->from('DatDocumentoCliente cc')
            ->where('cc.iddocumento=?', $iddocumento)
            ->andWhere('cc.tipocliente=?', 2)
            ->limit(1)
            ->fetcharray();

    }

    public function devolverDatActividadOrden($iddocumento)
    {
        $query = Doctrine_Query::create();
        return $query->select("*")
            ->from('DatActividadOrden')
            ->where('idordentrabajo=?', $iddocumento)
            ->fetchArray();
    }

    public function devolverDatMaterialesOrden($iddocumento)
    {
        $query = Doctrine_Query::create();
        return $query->select("*")
            ->from('DatMaterial')
            ->where('idordentrabajo=?', $iddocumento)
            ->fetchArray();
    }

    public function devolverDatMedioOrden($iddocumento)
    {
        $query = Doctrine_Query::create();
        return $query->select("*")
            ->from('DatMedio')
            ->where('idordentrabajo=?', $iddocumento)
            ->fetchArray();
    }

    public function devolverDatFallasOrdenTrabajo($iddocumento)
    {
        $query = Doctrine_Query::create();
        return $query->select("*")
            ->from('DatFallasOrdenTrabajo')
            ->where('idordentrabajo=?', $iddocumento)
            ->fetchArray();
    }

    public function devolverDatOrdenReclamacion($iddocumento)
    {
        $query = Doctrine_Query::create();
        return $query->select("*")
            ->from('DatOrdenReclamacion')
            ->where('idordentrabajo=?', $iddocumento)
            ->fetchArray();
    }

    public function devolverDatResponsableactividad($idactividad)
    {
        $query = Doctrine_Query::create();
        return $query->select("*")
            ->from('DatResponsableactividad')
            ->where('idactividad=?', $idactividad)
            ->fetchArray();

    }

    public function devolverDatSolucionOrdenTrabajo($iddocumento)
    {
        $query = Doctrine_Query::create();
        return $query->select("*")
            ->from('DatSolucionOrdenTrabajo')
            ->where('idordentrabajo=?', $iddocumento)
            ->fetchArray();
    }

    public function getOperacionByCliente($idcliente)
    {
        //$codigo = 'OPER_TALL_INTERNO';
        $codigo = 'OPER_TALL_TERCERO';
        $sql = "select coalesce(ncp.idestructura, -1) as idestructura, ncp.idsector as idsector from mod_datosmaestros.nom_clientesproveedor ncp where ncp.idclientesproveedores = {$idcliente}";
        $data = $this->doctrineHelper->getConnection()->fetchAssoc($sql);
        if (count($data)) {
            if ($data[0]['idsector'] == 10) {
                $codigo = 'OPER_TALL_PRIVADO';
            } else if ($data[0]['idestructura'] != -1) {
                $codigo = ($data[0]['idestructura'] == $this->global->Estructura->idestructura) ? 'OPER_TALL_INTERNO' : $codigo;
            }
        }
        $sqlIdoperacion = "select nv.valor from mod_logistica.nom_variableglobal nv
                          where nv.nombre = '{$codigo}'";
        $dataOper = $this->doctrineHelper->getConnection()->fetchAssoc($sqlIdoperacion);
        if (count($dataOper) > 0) {
            return $dataOper[0]['valor'];
        } else {
            return false;
        }
    }

    /**
     * @method Adicionar documento orden de trabajo
     * @param       $listActividades
     * @param       $listMateriales
     * @param       $listFallas
     * @param       $datosMedio
     * @param array $datosDoc
     *
     * @return array
     */
    public function adicionarOrdenTrabajo(
        $listActividades, $listMateriales, $listFallas, $datosMedio, $datosDoc = array(), $integrarFac = 0, $vg_operariosvarios = 0, $vg_usarubicaciontall)
    {
        if ($listActividades['idservicioold']) {
            $cant = Doctrine_Query::create()->select('idordenactividad')->from('DatActividadOrden')
                ->addWhere('idordentrabajo = ? ', array($datosDoc['iddocumento']))
                ->count();
            if ($cant > 0) {
                throw new ZendExt_Exception('LOG_T_003');
            }
        }
        if ( /*$this->verificarExistencianAtribIdentificador($datosDoc)*/
        true) { //Abrir varias ordenes al mismo medio a la vez
            $idoperacion = $this->getOperacionByCliente($datosDoc['idcliente']);
            if ($idoperacion) {
                $datosDoc['idoperacion'] = $idoperacion;
            }
            $doc = parent::adicionarDocumento($datosDoc);
            $idejercicio = ($datosDoc['iddocumento']) ? $doc->idejercicio : $this->configuracionHelper
                ->getEjercicioActualSubsistema($this->idestructuracomun, $this->idSubsistema);
            $doc->nrodoc = ($datosDoc['iddocumento']) ? $doc->nrodoc : $this->devolverUltimoNumeroDoc(
                null, null, $idejercicio, 'nrodoc'
            );
            $doc->save();
            parent::adicionarClientes(
                $doc->iddocumento, array(
                array('idcliente' => $datosDoc['idcliente'], 'tipocliente' => 1),
                array('idcliente' => $datosDoc['idcentrocosto'], 'tipocliente' => 2),
            ), true
            );

            $datosDoc['garantia'] = ($datosDoc['garantia']) ? $datosDoc['garantia'] : 0;
            $datosDoc['idtecnico'] = ($datosDoc['idtecnico']) ? $datosDoc['idtecnico'] : null;
            $datosDoc['tipo'] = ($datosDoc['tipo']) ? $datosDoc['tipo'] : 0;
            $datosDoc['estadoorden'] = ($datosDoc['estadoorden']) ? $datosDoc['estadoorden'] : 0;
            $datosDoc['importe'] = ($datosDoc['importetotal']) ? $datosDoc['importetotal'] : 0;
            $datosDoc['importealternativo'] = ($datosDoc['importealternativo']) ? $datosDoc['importealternativo'] : 0;
            $datosDoc['idtipoprecio'] = ($datosDoc['idtipoprecio']) ? $datosDoc['idtipoprecio'] : null;
            $datosDoc['documentoorigen'] = ($datosDoc['documentoorigen']) ? $datosDoc['documentoorigen'] : 0;
            $datosDoc['idordentrabajo'] = ($datosDoc['iddocumento']) ? $datosDoc['iddocumento'] : null;

            $datosDoc['idejercicio'] = $idejercicio;
            $datosDoc['nrodoc'] = $doc->nrodoc;
            $datosDoc['idestructuracomun'] = $this->idestructuracomun;
            $datosDoc['iddoc'] = $doc->iddoc;

            $objOrdenTrabajo = new DatOrdenTrabajo();
            $idProducto = $datosDoc['idproducto'];
            $datosDoc['idproducto'] = $datosDoc['idindicador'];

            if ($datosDoc['iddocumento']) {
                $datosAux = Doctrine::getTable('DatTrabajoServicio')->findByDql('idordentrabajo = ?', array($datosDoc['iddocumento']));
            }
            $save = $this->auxAdicionarOT($datosDoc, $doc, $idProducto, $objOrdenTrabajo, $datosMedio, $vg_usarubicaciontall);
            if ($save == 23505) {
                return array('codMsg' => 23505);
            }
            if ((!$datosDoc['iddocumento'] || $datosDoc['iddocumento']) && $this->usarTodas($datosDoc['idservicio'], $datosDoc['iddocumento'], $datosDoc['idtipoprecio'], $datosDoc['tiemporeal'], $listActividades['actividadesadd'])) {
                $datosAdd = $this->getActividadesServicio($datosDoc['idservicio'], $datosDoc['idtipoprecio'], $datosDoc['tiemporeal'], $listActividades['actividadesadd'], $datosDoc, $listActividades['actividadeselim']);

                $listActividades['actividadesadd'] = $datosAdd['actividades'];
                $listMateriales['materialesadd'] = ($listMateriales['materialesadd']) ? $listMateriales['materialesadd'] : $datosAdd['materiales'];
            } /*else if (!$datosDoc['iddocumento'] && !$this->usarTodas($datosDoc['idservicio'], $datosDoc['iddocumento'], $datosDoc['idtipoprecio'], $datosDoc['tiemporeal'], $listActividades['actividadesadd'])) {

            }*/
            else if ($datosDoc['iddocumento'] && !$this->usarTodas($datosDoc['idservicio'], $datosDoc['iddocumento'], $datosDoc['idtipoprecio'], $datosDoc['tiemporeal'], $listActividades['actividadesadd'])) {
                foreach ($listActividades['actividadesadd'] as &$la) {
                    $conn = Doctrine_Manager::connection();
                    $sql = "select cs.* from mod_logtaller.conf_actividad cs where cs.idactividad =({$la['idactividad']})";
                    $actividades = $conn->execute($sql)
                        ->fetchAll(PDO::FETCH_ASSOC);

                    if (!$la['precio']) {
                        $monedas = LogisticaGlobal::__init()->getMonedaEntidad();
                        $facServi = new FacturacionService();
                        $param = null;
                        $param->idindicador = $la['idindicador'];
                        $param->idtipoprecio = $datosDoc['idtipoprecio'];
                        $ordAux = Doctrine::getTable('DatOrdenTrabajo')->find($datosDoc['iddocumento']);
                        $param->idcliente = $ordAux->idcliente;
                        $param->costo = 1;
                        $param->servicio = 1;
                        $precio = $facServi->getPrecioVentaIndicador($param);
                        $la['precio'] = ($precio['datos'][$monedas->idmoneda]) ? $precio['datos'][$monedas->idmoneda]['precioventa'] : 0;
                        $la['precioalternativo'] = ($precio['datos'][$monedas->idmonedaalternativa]) ? $precio['datos'][$monedas->idmonedaalternativa]['precioventa'] : 0;
                        $la['idtipoprecio'] = $datosDoc['idtipoprecio'];

                    }

                    $la['costo'] = ($la['tiemporeal']) ? $la['tiemporeal'] * $la['precio'] : $la['costo'];
                    $la['importealternativo'] = ($la['tiemporeal']) ? $la['tiemporeal'] * $la['precioalternativo'] : $la['importealternativo'];
                    $la['tiempoplanificado'] = ($la['tiempoplanificado']) ? $la['tiempoplanificado'] : $actividades[0]['tiempoplanificado'];
                    if (!$la['tiemporeal']) {
                        $la['tiemporeal'] = $la['tiempoplanificado'];
                    }

                }
                $datosAdd['actividades'] = $listActividades['actividadesadd'];

                $listActividades['actividadesadd'] = $datosAdd['actividades'];
                $listMateriales['materialesadd'] = ($listMateriales['materialesadd']) ? $listMateriales['materialesadd'] : $datosAdd['materiales'];

            }
            $algunaExiste = $this->gestionarActividadesYMateriales($objOrdenTrabajo->idordentrabajo, $listActividades, $listMateriales, $integrarFac, $vg_operariosvarios);

            $this->gestionarFallasDeLaOrden($doc->iddocumento, $listFallas);
            $parametros['iddocumento'] = $doc->iddocumento;
            $this->calcularImporteOT($doc->iddocumento);
            $docCompleto = $this->devolverOrdenesTrabajo($parametros);

            $docCompleto = $docCompleto['datos'][0];
            return array('documento' => $docCompleto, 'algunaactvexistia' => $algunaExiste);
        } else {

            return array('identificadorduplicado' => true);
        }
    }

    public function getActividadesServicio($idservicio, $idtipoprecio, $tiemporeal, $actividadesadd, $arraydatosDoc, $actividadeselim)
    {
        $conn = Doctrine_Manager::connection();

        if (!$arraydatosDoc['iddocumento'] && empty($actividadesadd)) {
            $sql = "select cs.* from mod_logtaller.conf_actividad cs where cs.idpadre =({$idservicio})";
            $actividades = $conn->execute($sql)
                ->fetchAll(PDO::FETCH_ASSOC);
        } else if (empty($actividadesadd)) {
            $sql = "select cs.*,fechainicio,fechafin,idresponsable,observacion,tiemporeal,costo,idarea
                from mod_logtaller.conf_actividad cs inner join mod_logtaller.dat_ordenactividad oa on (cs.idactividad = oa.idactividad)
                where cs.idpadre =({$idservicio}) and oa.idordentrabajo = ({$arraydatosDoc['idordentrabajo']})";
            $actividades = $conn->execute($sql)
                ->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $actividades = $actividadesadd;
            $addAct = true;
        }
        if (!empty($actividadeselim)) {
            $excluirAct = implode(',', $actividadeselim);
            $sql = "select cs.* from mod_logtaller.conf_actividad cs where cs.idpadre =({$idservicio}) AND cs.idactividad not in ({$excluirAct}) ";
            $actividades = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        }

        $materiales = array();
        foreach ($actividades as &$d) {
            if ($addAct) {
                $sql = "select cs.* from mod_logtaller.conf_actividad cs where cs.idactividad =({$d['idactividad']})";
                $act = $conn->execute($sql)
                    ->fetchAll(PDO::FETCH_ASSOC);
                $d['tiempoplanificado'] = $act[0]['tiempoplanificado'];
                $d['duracion'] = $act[0]['duracion'];
                $d['idindicador'] = $act[0]['idindicador'];
            }
            $monedas = LogisticaGlobal::__init()->getMonedaEntidad();
            $facServi = new FacturacionService();
            $parametros = null;
            $parametros->idindicador = $d['idindicador'];
            $parametros->idtipoprecio = $idtipoprecio;
            $ordAux = Doctrine::getTable('DatOrdenTrabajo')->find($arraydatosDoc['idordentrabajo']);
            $parametros->idcliente = ($ordAux->idcliente) ? $ordAux->idcliente : $arraydatosDoc['idcliente'];
            $parametros->costo = 1;
            $parametros->servicio = 1;
            $precio = $facServi->getPrecioVentaIndicador($parametros);
            $d['precio'] = ($precio['datos'][$monedas->idmoneda]) ? $precio['datos'][$monedas->idmoneda]['precioventa'] : 0;
            $d['precioalternativo'] = ($precio['datos'][$monedas->idmonedaalternativa]) ? $precio['datos'][$monedas->idmonedaalternativa]['precioventa'] : 0;
            $d['idtipoprecio'] = $idtipoprecio;
            if (!$d['tiemporeal']) {
                $d['tiemporeal'] = $d['tiempoplanificado'];
            }
            $d['costo'] = $d['tiemporeal'] * $d['precio'];
            $d['importealternativo'] = $d['tiemporeal'] * $d['precioalternativo'];
//            $d['importealternativo'] = $listActividades['tiemporeal'] * $d['precio'];

            /*foreach ($actividadesadd as &$l) {
        if ($l['idactividad'] == $d['idactividad']) {
        $d['fechainicio'] = $l['fechainicio'] ? $l['fechainicio'] : $d['fechainicio'];
        $d['fechafin'] = $l['fechafin'] ? $l['fechafin'] : $d['fechafin'];
        $d['idresponsable'] = $l['idresponsable'] ? $l['idresponsable'] : $d['idresponsable'];
        $d['observacion'] = $l['observacion'] ? $l['observacion'] : $d['observacion'];
        $d['tiemporeal'] = ($l['tiemporeal']) ? $l['tiemporeal'] : $d['tiemporeal'];
        $d['costo'] = $l['tiemporeal'] * $d['precio'];
        $d['importealternativo'] = $l['tiemporeal'] * $d['precioalternativo'];
        }else{
        $sql = "select cs.* from mod_logtaller.conf_actividad cs where cs.idactividad =({$l['idactividad']})";
        $Confact = $conn->execute($sql)
        ->fetchAll(PDO::FETCH_ASSOC);
        $parametros->idindicador = $Confact[0]['idindicador'];
        $precio = $facServi->getPrecioVentaIndicador($parametros);
        $d['precio'] = ($precio['datos'][$monedas->idmoneda]) ? $precio['datos'][$monedas->idmoneda]['precioventa'] : 0;
        $d['precioalternativo'] = ($precio['datos'][$monedas->idmonedaalternativa]) ? $precio['datos'][$monedas->idmonedaalternativa]['precioventa'] : 0;
        $d['idtipoprecio'] = $idtipoprecio;
        $d['idactividad'] = $Confact[0]['idactividad'];
        $d['idindicador'] = $Confact[0]['idindicador'];
        $d['idpadre'] = $Confact[0]['idpadre'];
        $d['denominacion'] = $Confact[0]['denominacion'];
        $d['idarbol'] = $Confact[0]['idarbol'];
        $d['codigo'] = $Confact[0]['codigo'];
        $d['tiempoplanificado'] = $Confact[0]['tiempoplanificado'];
        $d['duracion'] = $Confact[0]['duracion'];
        $d['tiemporeal'] = ($l['tiemporeal']) ? $l['tiemporeal'] : $Confact[0]['tiempoplanificado'];
        $d['fechainicio'] = $l['fechainicio'];
        $d['fechafin'] = $l['fechafin'] ;
        $d['idresponsable'] = $l['idresponsable'];
        $d['observacion'] = $l['observacion'];
        $d['costo'] = $l['tiemporeal'] * $d['precio'];
        $d['importealternativo'] = $l['tiemporeal'] * $d['precioalternativo'];

        }
        }*/

        }
        $datos = array('actividades' => $actividades, 'materiales' => $materiales);

        /*  if (empty($actividades)) {

        foreach ($listActividades as &$la) {

        $monedas = LogisticaGlobal::__init()->getMonedaEntidad();
        $facServi = new FacturacionService();
        $parametros = null;
        $parametros->idindicador = $la['idindicador'];
        $parametros->idtipoprecio = $idtipoprecio;
        $precio = $facServi->getPrecioVentaIndicador($parametros);

        $la['precio'] = ($precio['datos'][$monedas->idmoneda]) ? $precio['datos'][$monedas->idmoneda]['precioventa'] : 0;
        $la['precioalternativo'] = ($precio['datos'][$monedas->idmonedaalternativa]) ? $precio['datos'][$monedas->idmonedaalternativa]['precioventa'] : 0;
        $la['idtipoprecio'] = $idtipoprecio;
        }
        $datos = array('actividades' => $listActividades, 'materiales' => $materiales);
        }*/
        return $datos;

    }

    private function usarTodas($idservicio, $iddocumento, $idtipoprecio, $tiemporeal, $listActividades)
    {
        $conn = Doctrine_Manager::connection();
        if ($idservicio == 1) {
            $sql = "select cs.usatodasnormas from mod_logtaller.conf_actividad cs where cs.idactividad = {$idservicio}";
            $datos = $conn->execute($sql)
                ->fetchAll(PDO::FETCH_COLUMN);
            if ($datos[0] == 1) {
                return true;
            }
            return false;
        } else {
            $conn = Zend_Registry::get('conexion');
            $selec = " SELECT usatodasnormas ";
            $from = " from mod_logtaller.conf_actividad cs ";
            $where = " where cs.idactividad IN ({$idservicio}) ";
            $datos = $conn->execute($selec . $from . $where)->fetchAll(PDO::FETCH_COLUMN);
            return $datos[0];
            /*foreach ($datos as $d) {
        if ($d == 1) {
        return true;
        $this->getActividadesServicio($idservicio, $idtipoprecio, $tiemporeal, $listActividades);

        }
        return false;
        }*/

        }

    }

    private function calcularImporteOT($idOrdenTrabajo)
    {
        $conn = Zend_Registry::get('conexion');
        $sql = " WITH subquery AS (SELECT ot.idordentrabajo,
                    ((select COALESCE(sum(a.costo),0) from mod_logtaller.dat_ordenactividad a  where a.idordentrabajo = ot.idordentrabajo)
                    + (select COALESCE(sum(m.cantidad*m.precio),0) from mod_logtaller.dat_material m where m.idordentrabajo = ot.idordentrabajo)
                    ) as  importecup,
                    ((select COALESCE(sum(aa.importealternativo),0) from mod_logtaller.dat_ordenactividad aa where aa.idordentrabajo = ot.idordentrabajo)
                    + (select COALESCE(sum(mm.cantidad*mm.precioalternativo),0) from mod_logtaller.dat_material mm  where mm.idordentrabajo = ot.idordentrabajo)
                    ) as importecuc

                     FROM mod_logtaller.dat_ordentrabajo ot
                     WHERE ot.idordentrabajo = {$idOrdenTrabajo}
                     GROUP BY ot.idordentrabajo
                )

                UPDATE  mod_logtaller.dat_ordentrabajo otu
                SET importe = subquery.importecup,
                    importealternativo = subquery.importecuc
                FROM subquery
                WHERE  otu.idordentrabajo = subquery.idordentrabajo ";
        $conn->execute($sql);

    }

    private function auxAdicionarOT($datosDoc, $doc, $idProducto, $objOrdenTrabajo, $datosMedio, $vg_usarubicaciontall)
    {
        $flag = false;
        if (!$datosDoc['iddocumento']) {
            $flag = true;
            $datosDoc['fechafin'] = ($datosDoc['fechafin']) ? $datosDoc['fechafin'] : null;
            $datosDoc['telefono'] = ($datosDoc['telefonoCliente']) ? $datosDoc['telefonoCliente'] : null;
            $datosDoc['textoCorreo'] = ($datosDoc['textoCorreoCliente']) ? $datosDoc['textoCorreoCliente'] : null;
            // Datos del responsable
            $datosDoc['telefonoresponsable'] = ($datosDoc['telefonoresponsable']) ? $datosDoc['telefonoresponsable'] : null;
            $datosDoc['nombreresponsable'] = ($datosDoc['nombreresponsable']) ? $datosDoc['nombreresponsable'] : null;
            $datosDoc['textocorreoresponsable'] = ($datosDoc['textocorreoresponsable']) ? $datosDoc['textocorreoresponsable'] : null;
            $datosDoc['idcarnetresponsable'] = (isset($datosDoc['idcarnetresponsable']) && $datosDoc['idcarnetresponsable'] != '') ? 
            (string)$datosDoc['idcarnetresponsable'] : null;
            $datosDoc['idordentrabajo'] = $doc->iddocumento;
            $listActividades['idservicioold'] = null;
            if ($this->_aperturaAFT && $this->_docAFTServices) {
                if ($idProducto && !$datosDoc['iddocumentoorigen'] && $datosDoc['documentoorigen'] == 6) {
                    $docEnvTall = $this->_docAFTServices->crearDocumentoEnvRepAutomatico(
                        null, array(), $idProducto
                    );
                    $docEnvTall = $docEnvTall->toArray();
                    $datosDoc['iddocumentoorigen'] = $docEnvTall['iddocumento'];
                }
            }
        } else {
            $datosDoc['importe'] = ($datosDoc['importetotal']) ? $datosDoc['importetotal'] : 0;
            $datosDoc['importealternativo'] = ($datosDoc['importealternativo']) ? $datosDoc['importealternativo'] : 0;
            $objOrdenTrabajo->assignIdentifier($datosDoc['iddocumento']);
        }

        $this->unsetValues($datosDoc);
        if (is_array($datosDoc)) {
            $objOrdenTrabajo->synchronizeWithArray($datosDoc);
        }
        try {
            $objOrdenTrabajo->save();
        } catch (Exception $e) {
            if ($e->getCode() == 23505) {
                return $e->getCode();
                //throw new ZendExt_Exception('LOG_LB_TALL_001');
                //throw new LogisticaException('LOG_LB_TALL_001', null, null, $objOrdenTrabajo->nrodoc);
            }
        }

        if ($vg_usarubicaciontall && $flag) {
            $datos = [];
            $fechahoy = date('d-m-Y');
            $datos[0]['fechainicio'] = $fechahoy;
            $datos[0]['idubicaciontall'] = 1;
            $params->datos = $datos;
            $params->iddocumento = $doc->iddocumento;
            $this->insertarubicacionestall($params);
        }
        if ($datosDoc['documentoorigen'] != 4) { //si el docorigen es 4 no tiene medio ni servicio
            $this->axiliarAdicionar($objOrdenTrabajo, $datosDoc, $datosMedio, $idProducto);
        }
    }

    private function unsetValues($paramas)
    {
        foreach ($paramas as $param => $value) {
            if (null == $value) {
                unset($paramas[$param]);
            }
        }

    }

    private function verificarExistencianAtribIdentificador($datosDoc)
    {
        if ($datosDoc['atributoidentificador']) {
            $param['estado'] = array(1, 2);
            $param['clienteorden'] = 1;
            $dql = parent::devolverDocumentos($param);
            $dql->innerJoin('d.DatOrdenTrabajo ord')
                ->addSelect('d.iddocumento as iddocumento, ord.atributoidentificador as atributoidentificador')
                ->andWhere('ord.atributoidentificador = ?', array($datosDoc['atributoidentificador']));
            $arrOrdenes = $dql->fetchArray();
            $cant = count($arrOrdenes);
            if ($datosDoc['iddocumento']) {
                if ($cant > 0 && $arrOrdenes[0]['iddocumento'] != $datosDoc['iddocumento']) {
                    return false;
                }
            } else {
                if ($cant > 0) {
                    return false;
                }
            }
        }
        return true;
    }

    private function axiliarAdicionar($objOrdenTrabajo, $datosDoc, $datosMedio, $idProducto)
    {

        $existe = Doctrine_Query::create()->select('md.idmedio')->from('DatMedio md')->where(
            'md.idordentrabajo = ?', array($objOrdenTrabajo->idordentrabajo)
        )->limit(1)->fetchArray();
        $objMedio = new DatMedio();
        if (count($existe) > 0) {
            $objMedio->assignIdentifier($existe[0]['idmedio']);
        }
        $objMedio->idordentrabajo = $objOrdenTrabajo->idordentrabajo;
        $objMedio->idindicador = $datosDoc['idindicador'];
        $objMedio->dinamicos = $datosMedio;
        $objMedio->idproducto = ($idProducto) ? $idProducto : null;
        $objMedio->idpadre = $datosDoc['idpadreindicador'];
        $objMedio->mediocliente = (isset($datosDoc['mediocliente']) && $datosDoc['mediocliente']) ? $datosDoc['mediocliente'] : 0;
        $objMedio->save();

        $existe = Doctrine_Query::create()->select('ts.idtrabajoservicio')->from('DatTrabajoServicio ts')->where(
            'ts.idordentrabajo = ?', array($objOrdenTrabajo->idordentrabajo)
        )->limit(1)->fetchArray();
        $ordenServicio = new DatTrabajoServicio();

        if (count($existe) > 0 && explode(',', $datosDoc['idservicio']) == 1) {
            $ordenServicio->assignIdentifier($existe[0]['idtrabajoservicio']);
            $ordenServicio->idordentrabajo = $objOrdenTrabajo->idordentrabajo;
            $ordenServicio->idservicio = $datosDoc['idservicio'];
            $ordenServicio->save();
        } else if (explode(',', $datosDoc['idservicio']) > 1) {

            $idordentrabajo = $datosDoc['idordentrabajo'];
            $serv = explode(',', $datosDoc['idservicio']);
            foreach ($serv as $s) {
                $sql = "INSERT INTO mod_logtaller.dat_trabajoservicio(idservicio, idordentrabajo)
                    VALUES ({$s},{$idordentrabajo})";
                $this->doctrineHelper->getConnection()->execute($sql);
            }
        }
        if ($datosDoc['otobservacion']) {
            $abc = DatDocObservaciones::buscarObservacion($objOrdenTrabajo->idordentrabajo);
            $docobs = new DatDocObservaciones();
            if (count($abc) > 0) {
                $docobs->assignIdentifier($abc[0]['iddocobservaciones']);
            }
            $docobs->iddocumento = $objOrdenTrabajo->idordentrabajo;
            $docobs->observaciones = $datosDoc['otobservacion'];
            $docobs->save();
        }

//        $ordenServicio->idservicio = $datosDoc['idservicio'];
    }

    /**
     * @method Gestiona las operaciones con las fallas de la orden de trabajo.
     * @param $idOrdenTrabajo
     * @param $listFallas
     *
     * @throws Doctrine_Query_Exception
     * @throws Exception
     */
    private function gestionarFallasDeLaOrden($idOrdenTrabajo, $listFallas)
    {
        if ($listFallas['fallaselim']) {
            Doctrine_Query::create()->delete('DatFallasOrdenTrabajo')->whereIn(
                'idfallasordentrabajo', $listFallas['fallaselim']
            )->execute();
        }
        if ($listFallas['fallasadd']) {
            $fallasAddArray = $this->auxGestFallasOrden($listFallas, $idOrdenTrabajo);
            if ($fallasAddArray->count()) {
                $fallasAddArray->save();
            }
        }
    }

    private function auxGestFallasOrden($listFallas, $idOrdenTrabajo)
    {
        $fallasAddArray = new Doctrine_Collection('DatFallasOrdenTrabajo');
        foreach ($listFallas['fallasadd'] as $falla) {
            $objFalla = new DatFallasOrdenTrabajo();
            $falla['idordentrabajo'] = $idOrdenTrabajo;
            $falla['idfalla'] = ($falla['idfalla'] == "") ? null : $falla['idfalla'];
            if ($falla['idfallasordentrabajo']) {
                $objFalla->assignIdentifier($falla['idfallasordentrabajo']);
            }
            if (is_array($falla)) {
                $objFalla->synchronizeWithArray($falla);
            }
            $fallasAddArray[] = $objFalla;
        }
        return $fallasAddArray;
    }

    /**
     * @method gestiona las operaciones con las actividades y los materiales de la orden de trabajo.
     * @param       $idordentrab
     * @param array $listActividades
     * @param array $listMateriales
     *
     * @throws Doctrine_Query_Exception
     * @throws Exception
     */
    private function gestionarActividadesYMateriales($idOrdenTrabajo, $listActividades = array(), $listMateriales = array(), $integrarFac = 0, $vg_operariosvarios = 0)
    {

        $listActividades['idservicioold'] = ($listActividades['idservicioold']) ? $listActividades['idservicioold'] : null;
        if ($listActividades['actividadeselim'] && !$listActividades['idservicioold']) {

            $listserv = (int)$listActividades['idservicioold'];
            $matporact = Doctrine_Query::create()->select('idmaterial')->from('DatMaterial')
                ->addWhere('idordentrabajo = ? ', array($idOrdenTrabajo))
                ->andWhereIn('idactividad ', $listActividades['actividadeselim'])
                ->fetchArray();
            if (count($matporact)) {
                $matporact = array_column($matporact, 'idmaterial');
            } else {
                $matporact = [];
            }

            $actvenOrden = Doctrine_Query::create()->select('idactividad')->from('DatActividadOrden')
                ->addWhere('idordentrabajo = ? ', array($idOrdenTrabajo))
                ->fetchArray();
            if ($vg_operariosvarios == 1) {
                if (count($matporact) > 0) {
                    Doctrine_Query::create()->delete('DatMaterial')->whereIn('idmaterial ', $matporact)
                        ->execute();
                }
            } else {
                foreach ($actvenOrden as $ac) {
                    if (!in_array($ac['idactividad'], $listActividades['actividadeselim']) && count($matporact) > 0) {
                        Doctrine_Query::create()->update('DatMaterial')->set('idactividad', $ac['idactividad'])
                            ->where('idordentrabajo = ? ', array($idOrdenTrabajo))
                            ->andWhereIn('idmaterial ', $matporact)
                            ->execute();
                        break;
                    }
//                    foreach($listActividades['actividadeselim'] as $l){
//                        if($ac['idactividad']!=$l){
//
//                        }
//
//                    }
                }
            }

            Doctrine_Query::create()->delete('DatActividadOrden')
                ->addWhere('idordentrabajo = ? ', array($idOrdenTrabajo))
                ->andWhereIn('idactividad ', $listActividades['actividadeselim'])
                //->andwhereIn('idpadre', $listserv)
                ->execute();
        } else if ($listActividades['actividadesadd'] || $listMateriales) {
            $algunaExiste = $this->auxiliarAdicionarActividades($listActividades['actividadesadd'], $idOrdenTrabajo);
            $this->auxGestMateriales($listMateriales, $integrarFac, $idOrdenTrabajo);
            return $algunaExiste;
        }
    }

    private function auxGestMateriales($listMateriales, $integrarFac, $idOrdenTrabajo)
    {
        if ($listMateriales['materialeselim'] || $listMateriales['idsactvmat']) {
            if ($this->_aperturaFAC && Zend_Json::decode($integrarFac)) {
                $servFac = new FacturacionService();
                if ($listMateriales['idsactvmat']) {
                    $servFac->delCategoriaIndExt($idOrdenTrabajo, false, $listMateriales['idsactvmat']);
                }
                if ($listMateriales['materialeselim']) {
                    $indProd =
                        Doctrine_Query::create()->select("idindicador, idactividad")->from('DatMaterial')
                            ->addWhere('idordentrabajo = ? ', array($idOrdenTrabajo))->andwhereIn(
                                'idmaterial ', $listMateriales['materialeselim']
                            )->fetchArray();
                    $servFac->delCategoriaIndExt($idOrdenTrabajo, $indProd, false);
                }
            }
            $listMateriales['idsactvmat'] = ($listMateriales['idsactvmat']) ? $listMateriales['idsactvmat'] : array(01);
            Doctrine_Query::create()->delete('DatMaterial')->whereIn('idmaterial ', $listMateriales['materialeselim'])
                ->orWhere(
                    'idordentrabajo = ? AND idactividad In ?', array($idOrdenTrabajo, $listMateriales['idsactvmat'])
                )
                ->execute();
            Doctrine_Query::create()->delete('DatDocumentocl')
                ->where(
                    'iddocumento = ? AND idindicador In ?', array($idOrdenTrabajo, $listMateriales['idsactvmat'])
                )
                ->execute();
        }

        $indicadoresFac = $this->auxiliarAdicionarMateriales($listMateriales['materialesadd'], $idOrdenTrabajo, $integrarFac);

        if ($this->_aperturaFAC && Zend_Json::decode($integrarFac)) {
            $faturaServ = new FacturacionService();
            $datos = array('idexterno' => $idOrdenTrabajo, 'indicador' => $indicadoresFac);
            $faturaServ->addCategoriaIndExt($datos);
        }
    }

    private function auxiliarAdicionarMateriales($materAdicionados, $idOrdenTrabajo, $integrarFAC = 0)
    {
        $materialesAddArray = new Doctrine_Collection('DatMaterial');

        if ($materAdicionados) {
            $indicadoresFac = array();
            foreach ($materAdicionados as $mater) {

                $mater['idunidadmedida'] = ($mater['idunidadmedida'] == "") ? null : $mater['idunidadmedida'];
                $mater['nomunidamedida'] = ($mater['nomunidamedida'] == "") ? null : $mater['nomunidamedida'];
                $mater['importecup'] = ($mater['importecup'] == "") ? 0 : $mater['importecup'];
                $mater['importecuc'] = ($mater['importecuc'] == "") ? 0 : $mater['importecuc'];
                $mater['iddeposito'] = ($mater['iddeposito'] == "") ? null : $mater['iddeposito'];
                $mater['idproducto'] = ($mater['idproducto'] == "") ? null : $mater['idproducto'];
                $mater['deposito'] = ($mater['deposito'] == "") ? null : $mater['deposito'];
                $mater['cantidad'] = isset($mater['cantidad']) ? $mater['cantidad'] : 0;
                $mater['precio'] = ($mater['precio'] == "") ? 0 : $mater['precio'];
                $mater['precioalternativo'] = ($mater['precioalternativo'] == "") ? 0 : $mater['precioalternativo'];
                unset($mater['nrovale']);
                if ($mater['porplan'] == "") {
                    $mater['porplan'] = 0;
                }
                $mater['aprobado'] = ($mater['aprobado'] == 1) ? true : false;
                $mater['noaplicargastoatrabajador'] = ($mater['noaplicargastoatrabajador'] == 1) ? true : false;
                $objMaterial = new DatMaterial();
                $mater['idordentrabajo'] = $idOrdenTrabajo;
                $mater['pendiente'] = $mater['cantidad'];
                if ($mater['idmaterial']) {
                    $objMaterial->assignIdentifier($mater['idmaterial']);
                    $auxObj = Doctrine::getTable('DatMaterial')->find($mater['idmaterial']);
                    $cantMat = $mater['cantidad'];
                    $mater['pendiente'] = $cantMat - $cantMat->facturado - $cantMat->enproceso;
                } /*else {

                if ($this->_aperturaFAC && Zend_Json::decode($integrarFAC)) {
                $datosFac = Zend_Json::decode(Zend_Json::decode($mater['datosmoneda']));
                $indicadoresFac[] = array(
                'idindicador' => $mater['idindicador'], 'datos' => $datosFac,
                'idtipoprecio' => $mater['idtipoprecio'], 'idactividad' => $mater['idactividad']
                );
                }
                }*/

                if (is_array($mater)) {
                    $objMaterial->synchronizeWithArray($mater);
                }
                $materialesAddArray[] = $objMaterial;

                $docCapacidadLiquida = new DatDocumentocl();
                if ($mater['capacidadliquida']) {
                    $docCapacidadLiquida['iddocumento'] = $idOrdenTrabajo;
                    $docCapacidadLiquida['idproducto'] = $mater['idproducto'] ? $mater['idproducto'] : null;
                    $docCapacidadLiquida['idindicador'] = $mater['idindicador'] ? $mater['idindicador'] : null;
                    $docCapacidadLiquida->save();
                }

            }
            if ($materialesAddArray->count()) {
                $materialesAddArray->save();
            }
            return $indicadoresFac;
        }
        return array();
    }

    private function auxiliarAdicionarActividades($activAdicionadas, $idOrdenTrabajo)
    {
        $algunaExiste = false;
        $actividadesAddArray = new Doctrine_Collection('DatActividadOrden');
        $actividadesPersonasAddArray = new Doctrine_Collection('DatActividadOrdenPersonas');
        if ($activAdicionadas) {

            foreach ($activAdicionadas as $actv) {
                $guardadas = Doctrine_Query::create()->select('act.*')->from('DatActividadOrden act')->where(
                    'act.idordentrabajo = ?', array($idOrdenTrabajo)
                )->andWhere('act.idactividad = ?', array($actv['idactividad']))->fetchArray();

                $this->objectHelper->unsetNullValues($actv);
                $actv['tiemporeal'] = ($actv['tiemporeal']) ? $actv['tiemporeal'] : $actv['tiempoplanificado'];
                //$actv['costo'] = ($actv['costo'] == "" || empty($actv['costo'])) ? $guardadas['costo'] : $actv['costo'];
                $actv['costo'] = $actv['tiemporeal'] * $actv['precio']; //esto lo puse nuevo Pedro
//                $actv['costo'] = $actv['minutosactividad'] > 0 ? ($actv['tiemporeal'] * (round($actv['minutosactividad']/60,2) * $actv['precio'])) : ($actv['tiemporeal'] * $actv['precio']);//esto lo puse nuevo Pedro
                $actv['importealternativo'] = $actv['tiemporeal'] * $actv['precioalternativo']; //esto lo puse nuevo Pedro
                $objActividad = new DatActividadOrden();
                $actv['idordentrabajo'] = $idOrdenTrabajo;
                $actv['idarea'] = ($actv['idarea'] == "") ? $guardadas['idarea'] : $actv['idarea'];
                $actv['fechainicio'] = ($actv['fechainicio'] == "") ? $guardadas['fechainicio'] : $actv['fechainicio'];
                $actv['fechafin'] = ($actv['fechafin'] == "") ? $guardadas['fechafin'] : $actv['fechafin'];
                $actv['umedida'] = ($actv['umedida'] == "") ? null : $actv['umedida'];
                $actv['idresponsable'] = ($actv['idresponsable'] == "") ? $guardadas['idresponsable'] : $actv['idresponsable'];
                $actv['tarifahora'] = ($actv['tarifahora'] == "") ? $guardadas['tarifahora'] : $actv['tarifahora'];
                //if($actv['precio'])
                //$actv['tiempoplanificado'] = ($actv['tiempoplanificado'] == "") ? 1 : $actv['tiempoplanificado'];
                $actv['pendiente'] = ($actv['tiemporeal'] == "") ? $guardadas['tiemporeal'] : $actv['tiemporeal'];
                //$actv = $this->auxAddActividades($idOrdenTrabajo, $actv);

                if (!$actv['minutosactividad']) {
                    $actv['minutosactividad'] = null;
                }

                if ($actv['idordenactividad']) {
                    $objActividad->assignIdentifier($actv['idordenactividad']);
                } else {
                    $exist = Doctrine_Query::create()->select('act.idordenactividad')->from('DatActividadOrden act')->where(
                        'act.idordentrabajo = ?', array($idOrdenTrabajo)
                    )->andWhere('act.idactividad = ?', array($actv['idactividad']))->fetchArray();

                    if (count($exist) > 0) {
                        $algunaExiste = true;
                        $objActividad->assignIdentifier($exist[0]['idordenactividad']);
                        $actv['idordenactividad'] = $exist[0]['idordenactividad'];
                    }
                }

                if ($actv['idordenactividad']) {
                    $auxObj = Doctrine::getTable('DatActividadOrden')->find($actv['idordenactividad']);
                    $cantAct = ($actv['tiemporeal'] == "") ? $guardadas['tiemporeal'] : $actv['tiemporeal'];
                    $actv['pendiente'] = $cantAct - $auxObj->facturado - $auxObj->enproceso;
                }

                if ($actv['arrayresponsables']) {
                    $arrayresponsables = json_decode($actv['arrayresponsables']);
                    foreach ($arrayresponsables as &$responsable) {
                        if ($responsable->eliminado == 1) {
                            DatActividadOrdenPersonas::eliminar($responsable->idordenactividadpersona);
                        } else {
                            $responsable->idordenactividad = $actv['idordenactividad'];
                            $actividadesPersonasAddArray[] = DatActividadOrdenPersonas::crearPersona($responsable);
                        }
                    }
                }

                if (is_array($actv)) {
                    $objActividad->synchronizeWithArray($actv);
                }

                $actividadesAddArray[] = $objActividad;

            }

            if ($actividadesAddArray->count()) {
                $actividadesAddArray->save();
            }
            if ($actividadesPersonasAddArray->count()) {
                $actividadesPersonasAddArray->save();
            }
        }
        return $algunaExiste;
    }

    private function auxAddActividades($idOrdenTrabajo, $actv)
    {

        $actv['idordentrabajo'] = $idOrdenTrabajo;
        $actv['idarea'] = ($actv['idarea'] == "") ? null : $actv['idarea'];
        $actv['fechainicio'] = ($actv['fechainicio'] == "") ? null : $actv['fechainicio'];
        $actv['fechafin'] = ($actv['fechafin'] == "") ? null : $actv['fechafin'];
        $actv['tiempoplanificado'] = ($actv['tiempoplanificado'] == "") ? null : $actv['tiempoplanificado'];
        $actv['umedida'] = ($actv['umedida'] == "") ? null : $actv['umedida'];
        $actv['idresponsable'] = ($actv['idresponsable'] == "") ? null : $actv['idresponsable'];
        $actv['tiemporeal'] = ($actv['tiemporeal'] == "") ? null : $actv['tiemporeal'];
        $actv['tarifahora'] = ($actv['tarifahora'] == "") ? null : $actv['tarifahora'];
        $actv['idindicador'] = ($actv['idindicador'] == "") ? null : $actv['idindicador'];

        return $actv;
    }

    /**
     * @param $parametros
     *
     * @return array
     */
    public function adicionarSolucion($parametros)
    {
        $solucion = new DatSolucionOrdenTrabajo();
        if ($parametros['idsolucionordentrabajo']) {
            $solucion->assignIdentifier($parametros['idsolucionordentrabajo']);
        }
        $solucion->idordentrabajo = $parametros['idordentrabajo'];
        $solucion->idtecnico = $parametros['idtecnico'];
        $solucion->solucion = $parametros['solucion'];
        $solucion->save();
        return array('idsolucionordentrabajo' => $solucion->idsolucionordentrabajo);
    }

    public function devolverSolucion($idOrdenTrabajo)
    {
        $query = Doctrine_Query::create();
        $resultado = $query->select('solu.idsolucionordentrabajo, solu.idtecnico, solu.solucion ')
            ->from('DatSolucionOrdenTrabajo solu')->where('idordentrabajo = ?', array($idOrdenTrabajo))->fetchArray();
        if (count($resultado) > 0) {
            return $resultado[0];
        } else {
            return null;
        }
    }

    public function devolverDatosMedio($idOrdenTrabajo)
    {

        $query = Doctrine_Query::create();
        $query->select('med.idmedio, med.idproducto as idactivo, med.dinamicos, med.idpadre, med.idindicador, med.mediocliente ')->from(
            'DatMedio med'
        )->leftJoin('med.NomIndicador ind')->addSelect('ind.denominacion as denominacion')->where(
            'idordentrabajo = ?', array($idOrdenTrabajo)
        );

        $resultado = $query->fetchArray();
        if (count($resultado) > 0) {
            return $resultado[0];
        } else {
            return null;
        }
    }

    public function eliminarOrden($idOrdenTrabajo, $integrarFac = false)
    {
        Doctrine_Query::create()->delete('DatDocumentocl')->whereIn('iddocumento ', $idOrdenTrabajo)->execute();
        Doctrine_Query::create()->delete('DatActividadOrden')->whereIn('idordentrabajo ', $idOrdenTrabajo)->execute();
        Doctrine_Query::create()->delete('DatMaterial')->whereIn('idordentrabajo ', $idOrdenTrabajo)->execute();
        Doctrine_Query::create()->delete('DatOrdenReclamacion')->whereIn('idordentrabajo ', $idOrdenTrabajo)->execute();
        Doctrine_Query::create()->delete('DatFallasOrdenTrabajo')->whereIn('idordentrabajo ', $idOrdenTrabajo)->execute();
        Doctrine_Query::create()->delete('DatSolucionOrdenTrabajo')->whereIn('idordentrabajo ', $idOrdenTrabajo)
            ->execute();
        Doctrine_Query::create()->delete('DatTrabajoServicio')->whereIn('idordentrabajo ', $idOrdenTrabajo)->execute();
        Doctrine_Query::create()->delete('DatSolucionOrdenTrabajo')->whereIn('idordentrabajo ', $idOrdenTrabajo)
            ->execute();
        if (class_exists('DatPedido')) {
            Doctrine_Query::create()->delete('DatPedidoOrdenTrabajo')->whereIn('idordentrabajo ', $idOrdenTrabajo)
                ->execute();
        }
        foreach ($idOrdenTrabajo as $idDocumento) {
            if ($this->_aperturaAFT) {
                $medio = Doctrine_Query::create()->select('med.idproducto as idregnumerico, med.idindicador as idprod')
                    ->from('DatMedio med')->where(
                        'med.idordentrabajo = ?', array($idDocumento)
                    )->fetchArray();
                if ($medio[0]['idregnumerico']) {
                    $parametros = $medio[0];
                    $parametros['datosEnvRep'][0] = json_decode(json_encode($parametros));
                    $parametros['iddocumentoOld'] = $idDocumento;
                    $addDocEnvRep = $this->_docAFTServices->addDocDeEnviadoReparar($parametros);
                }
            }
            /*if ($this->_aperturaAFT) {
            $doc = Doctrine::getTable('DatOrdenTrabajo')->find($idDocumento);
            if ($doc->documentoorigen == 6) {
            $this->_docAFTServices->eliminarDocEnvRepAutomatico($doc->iddocumentoorigen);
            }
            }*/
            $respuesta = parent::eliminarDocumento($idDocumento);
            if ($this->_aperturaFAC && Zend_Json::decode($integrarFac)) {
                $servFac = new FacturacionService();
                $servFac->delCategoriaIndExt($idDocumento);
            }
        }
        return $respuesta;
    }

    public function confirmarOrden($idOrdenTrabajo, $params = false)
    {
        return parent::confirmarDocumento($idOrdenTrabajo);
    }

    public function anularOrden($idOrdenTrabajo)
    {
        return parent::anularEstadoDocumento($idOrdenTrabajo);
    }

    public function rectificarOrden($idOrdenTrabajo)
    {
        $conn = Zend_Registry::get('conexion');
        $this->trazaDocumento->guardarTraza('Orden rectificada ', $idOrdenTrabajo);
        $conn->execute("
            UPDATE mod_logtaller.dat_ordentrabajo
            SET fechacierre= null
            WHERE idordentrabajo = {$idOrdenTrabajo}");
        return $conn->execute("
            UPDATE mod_logistica.dat_documento
            SET estado= 2
            WHERE iddocumento = {$idOrdenTrabajo}");

    }

    public function validarExistenciaDocGenerado($iddocumento, $ignorar = false)
    {
        if ($ignorar) {
            return true;
        } else {
            return Doctrine_Query::create()->select()->from('DatDocumentoPadre dp')->whereIn('dp.idpadre', $iddocumento)
                    ->count() == 0;
        }

    }

    public function aprobarOrden($idOrdenTrabajo)
    {
        return parent::aprobarDocumento($idOrdenTrabajo, true);
    }

    public function cerrarOrdenTrabajo($idOrdenTrabajo, $vg_usarubicaciontall)
    {
        $oTrabj = Doctrine::getTable('DatOrdenTrabajo')->find($idOrdenTrabajo);
        $fechaInicio = DateTime::createFromFormat("d/m/Y", $oTrabj->fechainicio);
        $fechaCierre = DateTime::createFromFormat("d/m/Y", $this->global->FechaContable->fecha);
        $cfgTallModel = new ConfiguracionTalleresModel();
        $confTalleres = $cfgTallModel->cargarConfiguracionTalleres()['datos'];
        if ($fechaInicio > $fechaCierre) {
            throw new LogisticaException('LOG_T_006', null, null, $this->global->FechaContable->fecha);
        }
        if (!$this->_vgoperariosvarios && $confTalleres[cerraroperarios] == 1) {
            $idActividadesSinTecnicos = $this->getActividadesSinTecnico($idOrdenTrabajo);
            if (count($idActividadesSinTecnicos) > 0) {
                return [
                    'success' => false,
                    'codigoMsg' => -3,
                    'msg' => 'No se puede facturar la orden debido a que las siguientes actividades no tienen operario asignadas:',
                    'datos' => array_column($idActividadesSinTecnicos, 'denominacion')
                ];
            }
        }

        $this->trazaDocumento->guardarTraza('Estado cerrado ', $idOrdenTrabajo, EstadoDocumentoModel::ESTADO_CERRADO);
        Doctrine_Query::create()->update('DatDocumento d')->set('d.estado', EstadoDocumentoModel::ESTADO_CERRADO)
            ->where("d.iddocumento = ?", array($idOrdenTrabajo))->execute();

        $oTrabj->fechacierre = $this->global->FechaContable->fecha;
        $oTrabj->cerradopor = $this->idusuario;
        if ($vg_usarubicaciontall) {
            $datos = [];
            $datos[0]['fechainicio'] = $oTrabj->fechacierre;
            $datos[0]['idubicaciontall'] = 2;
            $params->datos = $datos;
            $params->iddocumento = $idOrdenTrabajo;
            $this->insertarubicacionestall($params);
        }
        $oTrabj->save();
        if ($oTrabj->documentoorigen == 1 || $oTrabj->documentoorigen == 3) { //si es por una solicitud o solicituad a tercero
            $solicitud = Doctrine::getTable('DatDocumento')->find($oTrabj->iddocumentoorigen);
            $solicitud->estado = EstadoDocumentoModel::ESTADO_CERRADO;
            $solicitud->save();
        }

        if ($this->_aperturaAFT) {
            $medio = Doctrine_Query::create()->select('med.idproducto as idregnumerico, med.idindicador as idprod')
                ->from('DatMedio med')->where(
                    'med.idordentrabajo = ?', array($idOrdenTrabajo)
                )->fetchArray();
            if ($medio[0]['idregnumerico']) {
                if ($oTrabj->tipo == 1) {
                    Doctrine_Query::create()->update('DatRegMantenimiento drm')->set('drm.estado', 2)->where(
                        "drm.idregnumerico = ? and drm.idplanificacionmantenimiento = ?",
                        array($medio[0]['idregnumerico'], $oTrabj->idplanificacionmantenimiento)
                    )->execute();
                } else {
                    $parametros = $medio[0];
                    $parametros['datosEnvRep'][0] = json_decode(json_encode($parametros));
                    $parametros['iddocumentoOld'] = $idOrdenTrabajo;
                    $addDocEnvRep = $this->_docAFTServices->addDocDeEnviadoReparar($parametros);
                }
                $this->agregarPiezasAlRegNumerico($idOrdenTrabajo);
            }
        }
        $this->updateDatosMateriasles($idOrdenTrabajo);
        $respuesta = true;
        $confFact = Doctrine::getTable('ConfTallerFacturacion')->find($this->global->Estructura->idestructura);
        if ($confFact && $confFact->facturarcerrar && !$oTrabj->garantia) {
            $respuesta = $this->facturarOrdenTrabajo($idOrdenTrabajo, $confFact)['datos'];
        } else if ($oTrabj->garantia) {
            $tom = new TrabajoOperariosModel();
            $tom->agregarNuevoTrabajoOperarios($idOrdenTrabajo);
            $tom->actualizarEstadoTrabajoOperarios($idOrdenTrabajo);
        }

        if ($confTalleres['comprobante']) {
            $comp = $this->generarComprobante($idOrdenTrabajo, LogisticaGlobal::SUBSISTEMA_TALLERES);
            $resultado['comprobante'] = $comp[0];
            if (is_array($respuesta)) {
                $respuesta['comprobante'] = $comp[0];
            } else {
                $respuesta = array('success' => true, 'comprobante' => $comp[0]);
            }
        }
        //$this->aprobarDistribucion($idOrdenTrabajo);
        return $respuesta;
    }

    public function facturarOrdenTrabajo($iddocumento, $configuracion)
    {
        if ($this->_aperturaFAC) {

            if ($this->_vgoperariosvarios) {
                $idActividadesSinOperarios = LogisticaDoctrineHelper::__init()->getConnection()->execute("
                    select oa.idordenactividad, ca.denominacion
                    from mod_logtaller.dat_ordentrabajo ot
                    inner join mod_logtaller.dat_ordenactividad oa on(oa.idordentrabajo = ot.idordentrabajo)
                    inner join mod_logtaller.conf_actividad ca on (oa.idactividad = ca.idactividad)
                    left join mod_logtaller.dat_ordenactividadpersonas oap on(oap.idordenactividad = oa.idordenactividad)
                    where ot.idordentrabajo = {$iddocumento}
                    and oap.idordenactividad is null
                    group by oa.idordenactividad, ca.denominacion
                ")->fetchAll(PDO::FETCH_ASSOC);
                if (count($idActividadesSinOperarios) > 0) {
                    return [
                        'success' => false,
                        'codigoMsg' => -3,
                        'msg' => 'No se puede facturar la orden debido a que las siguientes actividades no tienen operario asignadas:',
                        'datos' => array_column($idActividadesSinOperarios, 'denominacion')
                    ];
                }
            }
            $estado = $this->estadoModel->getEstadoActual($iddocumento);
            if ($estado == EstadoDocumentoModel::ESTADO_PENDIENTE || $estado == EstadoDocumentoModel::ESTADO_CERRADO) {
                $qCliente = Doctrine::getTable('DatDocumentoCliente')->findByDql('iddocumento = ? and tipocliente = 1', array($iddocumento));
                $facServi = new FacturacionService();
                $params = new stdClass();
                $params->idcliente = $qCliente[0]->idcliente;
                $params->documentos = array($iddocumento);
                $parametros['cliente'] = array(
                    $params,
                );
                $parametros['tipoDoc'] = 8;
                $parametros['idsubsistema'] = LogisticaGlobal::SUBSISTEMA_TALLERES;
                $filtro['mayorista'] = 1;
                $filtro['idcliente'] = $params->idcliente;
                if ($configuracion) {
                    $clMayoristasAux = $this->configuracionHelper->getClientesProveedorByParams(
                        false, $this->global->Estructura->idestructura, true,
                        true, false, $filtro, null, null
                    )['datos'];
                    $clMayoristas = LogisticaObjectHelper::__init()
                        ->extractValueFromArrayColumn($clMayoristasAux, 'idclientesproveedores');

                    if (!count($clMayoristas)) {
                        $parametros['idoperacion'] = $configuracion->idoperacion;
                    } else {
                        $parametros['idoperacion'] = (is_numeric($configuracion->idoperacionmayorista) ? $configuracion->idoperacionmayorista : $configuracion->idoperacion);
                    }

                }
                return [
                    'success' => true,
                    'codigoMsg' => 1,
                    'msg' => 'Facturado correctamente.',
                    'datos' => $facServi->generarFacturaExterna($parametros)
                ];
            } else {
                return [
                    'success' => false,
                    'codigoMsg' => -2,
                    'msg' => 'Solo se puede facturar cuando la orden de trabajo este en estado elaboracion o cerrada.'
                ];
            }
        } else {
            return [
                'success' => false,
                'codigoMsg' => -1,
                'msg' => 'Debe aperturar facturacion.'
            ];
        }
    }

    public function actualizarCumplimiento($parametros)
    {
        if (!count($parametros)) {
            return false;
        }
        if ($parametros['actividades']) {
            $collCumplimientoAct = new Doctrine_Collection('DatActividadOrden');
            foreach ($parametros['actividades'] as $datosMovimiento) {
                $actividad = Doctrine::getTable('DatActividadOrden')->findByDql(
                    'idordentrabajo = ? and idindicador = ?',
                    array($datosMovimiento['iddocorigen'][0], $datosMovimiento['idindicador'])
                );
                if (count($actividad) > 0) {
                    $cumplimiento = new DatActividadOrden();
                    $cumplimiento->assignIdentifier($actividad[0]['idordenactividad']);
                    $enprocesoTotal = $datosMovimiento['enprocesoviejo'] - $datosMovimiento['enprocesonuevo'];
                    if (!$datosMovimiento['entregado']) {
                        $datosMovimiento['entregado'] = 0;
                    }
                    if ($enprocesoTotal > 0) {
                        if (($cumplimiento->enproceso - ($datosMovimiento['entregado'] + $enprocesoTotal)) < 0) {
                            $enproceso = $cumplimiento->enproceso;
                        } else {
                            $enproceso = $enprocesoTotal;
                        }
                    } else {
                        if (($cumplimiento->enproceso - ($datosMovimiento['entregado'] + $enprocesoTotal) +
                                $cumplimiento->facturado) >
                            $cumplimiento->tiemporeal) {
                            $enproceso = -$cumplimiento->pendiente;
                        } else {
                            $enproceso = $enprocesoTotal;
                        }
                    }
                    $cumplimiento->facturado = $cumplimiento->facturado + $datosMovimiento['entregado'];
                    if ($datosMovimiento['entregado'] >= 0) {
                        $cumplimiento->enproceso = $cumplimiento->enproceso - $enproceso - $datosMovimiento['entregado'];
                        $cumplimiento->pendiente = $cumplimiento->tiemporeal - $cumplimiento->enproceso - $cumplimiento->facturado;
                        //Actualizar el estado de trabajooperarios para q se muestre
                        $tom = new TrabajoOperariosModel();
                        $tom->actualizarEstadoTrabajoOperarios('', $parametros['iddocumento'], $actividad[0]['idactividad']);
                    } else {
                        $cumplimiento->pendiente = $cumplimiento->pendiente - $datosMovimiento['entregado'];
                    }
                    $collCumplimientoAct->add($cumplimiento);
                    //agregar nuevo trabajooperarios
                    if ($datosMovimiento['enprocesonuevo'] > 0) {
                        $tom = new TrabajoOperariosModel();
                        $tom->agregarNuevoTrabajoOperarios($datosMovimiento['iddocorigen'][0], $parametros['iddocumento'], $actividad[0]['idordenactividad']);
                    }
                }
            }
            if ($collCumplimientoAct->count()) {
                $collCumplimientoAct->save();
            }
        }
        if ($parametros['productos']) {
            $collectionCumplimiento = new Doctrine_Collection('DatMaterial');
            foreach ($parametros['productos'] as $datosMovimiento) {
                if ($datosMovimiento['idactividad']) {
                    $material = Doctrine::getTable('DatMaterial')->findByDql(
                        'idordentrabajo = ? and idindicador = ? and idproducto = ? and idactividad = ?',
                        array($datosMovimiento['iddocorigen'][0], $datosMovimiento['idindicador'], $datosMovimiento['idproducto'], $datosMovimiento['idactividad'])
                    );
                } else {
                    $material = Doctrine::getTable('DatMaterial')->findByDql(
                        'idordentrabajo = ? and idindicador = ? and idproducto = ?',
                        array($datosMovimiento['iddocorigen'][0], $datosMovimiento['idindicador'], $datosMovimiento['idproducto'])
                    );
                }
                $cumplimiento = new DatMaterial();
                $cumplimiento->assignIdentifier($material[0]['idmaterial']);
                $enprocesoTotal = $datosMovimiento['enprocesoviejo'] - $datosMovimiento['enprocesonuevo'];
                if (!$datosMovimiento['entregado']) {
                    $datosMovimiento['entregado'] = 0;
                }
                if ($enprocesoTotal > 0) {
                    if (($cumplimiento->enproceso - ($datosMovimiento['entregado'] + $enprocesoTotal)) < 0) {
                        $enproceso = $cumplimiento->enproceso;
                    } else {
                        $enproceso = $enprocesoTotal;
                    }
                } else {
                    if (($cumplimiento->enproceso - ($datosMovimiento['entregado'] + $enprocesoTotal) +
                            $cumplimiento->facturado) >
                        $cumplimiento->cantidadreal) {
                        $enproceso = -$cumplimiento->pendiente;
                    } else {
                        $enproceso = $enprocesoTotal;
                    }
                }
                $cumplimiento->facturado = $cumplimiento->facturado + $datosMovimiento['entregado'];
                if ($datosMovimiento['entregado'] >= 0) {
                    $cumplimiento->enproceso = $cumplimiento->enproceso - $enproceso - $datosMovimiento['entregado'];
                    $cumplimiento->pendiente = $cumplimiento->cantidadreal - $cumplimiento->enproceso - $cumplimiento->facturado;
                } else {
                    $cumplimiento->pendiente = $cumplimiento->pendiente - $datosMovimiento['entregado'];
                }
                $collectionCumplimiento->add($cumplimiento);
            }
            if ($collectionCumplimiento->count()) {
                $collectionCumplimiento->save();
            }
        }
        return true;
    }

    private function aprobarDistribucion($idOrdenTrabajo)
    {
        $select = 'ot.iddocumentoorigen as idpedido, act.idindicador as idindicador ';
        $query = Doctrine_Query::create()->select($select)->from('DatOrdenActividad act')->innerJoin(
            'act.DatOrdenTrabajo ot'
        )->where('ot.idordentrabajo = ? ', array($idOrdenTrabajo))->andWhere('ot.documentoorigen = ? ', array(4));
        $servicios = $query->fetchArray();
        if (count($servicios) > 0) {
            $params = array('iddocumento' => $servicios[0]['iddocumentoorigen'], 'servicios' => $servicios);
            $pedidoServices = new PedidoService();
            $pedidoServices->aprobarDistribucion($params);
        }
    }

    private function agregarPiezasAlRegNumerico($idOrdenTrabajo)
    {
        $select = 'ot.idordentrabajo as idordentrabajo, med.idproducto as idregnumerico,
        mat.idmaterial, mat.idindicador, mat.cantidad, ind.idpadre as idpadre, ind.denominacion as denominacion ';
        $query = Doctrine_Query::create()->select($select)->from('DatMaterial mat')->innerJoin('mat.DatOrdenTrabajo ot')
            ->innerJoin('ot.DatMedio med')->where('ot.idordentrabajo = ? ', array($idOrdenTrabajo))
            ->innerJoin('mat.NomIndicador ind');
        $piezas = $query->fetchArray();

        $arrPiezas = array();
        foreach ($piezas as $pz) {
            //comprueba que este configurado y la naturaleza se PPA
            $yes = $this->_ppaService->estaConfigurado($pz['idpadre']);

            if (count($yes) > 0) {
                for ($i = 0; $i < $pz['cantidad']; $i++) {
                    $piezaNew = array();
                    $piezaNew['datos'] = array();
                    $piezaNew['fechaadquisicion'] = date('d/m/Y');
                    $piezaNew['idregnumerico'] = $pz['idregnumerico'];
                    $piezaNew['idindicador'] = $pz['idindicador'];
                    $piezaNew['denominacion'] = $pz['denominacion'];
                    $piezaNew['idpadre'] = $pz['idpadre'];
                    $piezaNew['idordentrabajo'] = $pz['idordentrabajo'];
                    $arrPiezas[] = $piezaNew;
                }
            }
        }
        $this->_ppaService->adicionarPieza($arrPiezas);
    }

    /**
     * @method devuelve los clientes
     * @param $parametros
     *
     * @return mixed
     */
    public function cargarClientes($parametros)
    {
        return $this->configuracionHelper->obtenerClientes(
            $this->idestructuracomun, $parametros['start'], $parametros['limit'], $parametros
        );
    }

    /**
     * @method devuelve las personas de la entidad
     * @param $idEntidad
     *
     * @return mixed
     */
    public function cargarPersonas($idEntidad = null, $params = array())
    {
        $params['idspersonas'] = ($params['idspersonas']) ? $params['idspersonas'] : array();
        $params['criterio'] = ($params['criterio']) ? $params['criterio'] : null;
        $params['start'] = ($params['start']) ? $params['start'] : 0;
        $params['limit'] = ($params['limit']) ? $params['limit'] : 30;
//        if (!$idEntidad) {
//            $idEntidad = $this->global->Estructura->idestructura;
//        }
        $limit = false;
        if (!$params['all']) {
            $limit = $params['limit'];
        }

        $personas = $this->_serviciosRecursosHumanos->getPrincipalesDatosPersona(
            $params['idspersonas'], $params['criterio'], $limit, $params['start'], array(), array(),
            $idEntidad
        );
        return array("datos" => ($personas->data) ? $personas->data : array(), "cantidad" => $personas->quantity);
    }

    public function cargarPersonasConContactos($params = array())
    {
        $params['criterio'] = ($params['criterio']) ? $params['criterio'] : null;
        $params['start'] = ($params['start']) ? $params['start'] : 0;
        $params['limit'] = ($params['limit']) ? $params['limit'] : 30;
        $sqlFiltro = '';
        if ($params['criterio']) {
            $sqlFiltro = "
            AND (
                per.nombre ilike '%{$params['criterio']}%'
             OR per.papel ilike '%{$params['criterio']}%'
             OR per.sapel ilike '%{$params['criterio']}%'
             OR per.idsuin ilike '%{$params['criterio']}%'
            )
        ";
        }

        $res = LogisticaDoctrineHelper::__init()->getConnection()->execute("
            select per.nombre, per.snombre, per.papel, per.sapel, per.idsuin,
            per.nombre || ' ' || coalesce(per.snombre, '') || ' ' || per.papel || ' ' || per.sapel as nombreapellidos,
            case when idtipomediocontacto = 1 then string_agg(con.contacto::text, ', ') else '' end as telefono,
            case when idtipomediocontacto = 2 then string_agg(con.contacto::text, ', ') else '' end as correo,
            count(*) over() as cantidad
            from mod_persona.dat_persona per
            left join mod_persona.dat_contacto con on(con.idpersona = per.idpersona)
            where (idtipomediocontacto = 1 OR idtipomediocontacto = 2)
            $sqlFiltro
            group by per.nombre, per.snombre, per.papel, per.sapel, per.idsuin, idtipomediocontacto
            order by per.nombre, per.papel, per.sapel
            offset {$params['start']}
            limit {$params['limit']}

        ")->fetchAll(PDO::FETCH_ASSOC);

        return array("datos" => $res, "cantidad" => $res[0] ? $res[0]['cantidad'] : 0);
    }

    /**
     * @method devuelve las personas del Ã¡rea interna
     * @param $idAreaInterna
     *
     * @return mixed
     */
    public function cargarPersonasAreaIinterna($idAreaInterna, $params = array())
    {

        if ($idAreaInterna) {
            $params['idspersonas'] = ($params['idspersonas']) ? $params['idspersonas'] : array();
            $params['criterio'] = ($params['criterio']) ? $params['criterio'] : null;
            $params['start'] = ($params['start']) ? $params['start'] : 0;
            $params['limit'] = ($params['limit']) ? $params['limit'] : 30;
            $personas = $this->_serviciosRecursosHumanos->getPrincipalesDatosPersona(
                $params['idspersonas'], $params['criterio'], $params['limit'], $params['start'], array(), array(), $idAreaInterna
            );
//            return $personas->data;
            return array("datos" => ($personas->data) ? $personas->data : array(), "cantidad" => $personas->quantity);
        } else {
            return $this->cargarPersonas($this->idestructuracomun, $params);
        }
    }

    /**
     * @method devuelve las actividades del nivel especificado o la actividad especificada con sus  hijos
     * @param $parametros
     *
     * @return array
     */
    public function cargarActividadesExistentes($param)
    {

        $cfgContrato = new ConfiguracionTalleresModel();
        $confTalleres = $cfgContrato->cargarConfiguracionTalleres()['datos'];
        $conn = Zend_Registry::get('conexion');
        $selec = "Select ca.idactividad, ca.idindicador, ca.idpadre, ca.idarbol,ca.usatodasnormas,
                  coalesce(i.numeropieza,i.codigo) as codigo,um.abreviaturaunidadmedida as umedida,
                  coalesce(i.denominacion,ca.denominacion) as denominacion, sa.idcentrodecosto, sa.idarea, ca.tempario";
        $from = " FROM  mod_logtaller.conf_actividad ca
                left join mod_datosmaestros.nom_indicador i on i.idindicador = ca.idindicador
                left join mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = i.idumedida
                left join mod_logtaller.dat_actividadentidad dae on ca.idactividad = dae.idactividad
                left join mod_logtaller.conf_servicioarea sa on sa.idservicio = ca.idactividad
         ";
        $where = " WHERE  dae.identidad = {$this->global->Estructura->idestructura}";
        //Excluiye los que ya estan adicionado en la orden
        if ($param['idordentrabajo']) {
            $where .= "  AND ca.idactividad  not in (Select ota.idactividad
                  FROM mod_logtaller.dat_ordenactividad ota  WHERE  ota.idordentrabajo = {$param['idordentrabajo']} ) ";
        }
        if ($confTalleres && $confTalleres['centrocostosporactividad'] == 1 && $param['nivel'] != 2) {
            $where .= "  AND sa.idcentrodecosto is not null";
        }
        //Pq de la vista venian los niveles de planificacion y el 2 es el que corresponde con los servicios
        //if ($param['nivel'] != 2) { //Se comentario porque ya no esta integrado con planificacion
        //  if ($param['todo']) {      //Se comentario porque ya no esta integrado con planificacion
        //      $where .= "  AND ca.idpadre is not null ";//Se comentario porque ya no esta integrado con planificacion
        //  } else                                        //Se comentario porque ya no esta integrado con planificacion
        //      $where .= "  AND ca.idpadre = {$param['idservicio']} "; //Se comentario porque ya no esta integrado con planificacion
        // }                                                                 //Se comentario porque ya no esta integrado con planificacion
        //else {                                                        //Se comentario porque ya no esta integrado con planificacion
        //las actividades del primer nivel no tienen indicador

        /* $where .= "  AND ca.idindicador is null ";
        if($param['nivel'] == 4){

        $where .= "  AND ca.idindicador is not null";
        }
        //  }
        if ($param['excluir'] && is_array($param['excluir'])) {
        $excluir = implode(",", $param['excluir']);
        $where .= "  AND ca.idactividad  in ({$excluir}) ";
        }*/

        if ($param['nivel'] == 4) {

            if ($param['todo']) {
                $where .= "  AND ca.idpadre is not null ";
            } else {
                if (is_array($param['idservicio'])) {
                    $servicios = implode(",", $param['idservicio']);

                    $where .= "  AND ca.idpadre  In ({$servicios})";
                } else {
                    $where .= "  AND ca.idpadre = {$param['idservicio']}";
                }

            }
        } else {
            //las actividades del primer nivel no tienen indicador
            $where .= "  AND ca.idindicador is null ";
        }
        if ($param['excluir'] && is_array($param['excluir'])) {
            $excluir = implode(",", $param['excluir']);
            $where .= "  AND ca.idactividad  in ({$excluir}) ";
        }

        //Filtro de la busqueda basica
        if ($param['criterio']) {
            $where .= " and (i.codigo ilike '%{$param['criterio']}%'
                        or i.denominacion  ilike '%{$param['criterio']}%'
                        or i.numeropieza  ilike '%{$param['criterio']}%')";
        }

        if ($param['idarea']) {
            $where .= " and sa.idarea = {$param['idarea']}";
        }
        $limit = "";
        if ($param['limit']) {
            $limit .= " LIMIT {$param['limit']} ";
        }
        if ($param['start']) {
            $limit .= "OFFSET {$param['start']} ";
        }
        $total = LogisticaDoctrineHelper::__init()->getConnection()->execute($selec . $from . $where)
            ->fetchAll(PDO::FETCH_ASSOC);
        $groupby = " group by ca.idactividad, ca.idindicador, ca.idpadre, ca.idarbol,ca.usatodasnormas
			, i.numeropieza, i.codigo, i.denominacion, ca.denominacion
			, um.abreviaturaunidadmedida, sa.idcentrodecosto, sa.idarea, ca.tempario";
        $orderby = " order by i.numeropieza,i.codigo";
        $result = $conn->execute($selec . $from . $where . $groupby . $orderby . $limit)->fetchAll();

        $monedas = LogisticaGlobal::__init()->getMonedaEntidad();
        //Si esta aperturado facturacion y por recurso se agrega que se integra con facturacion
        if ($this->_aperturaFAC && Zend_Json::decode($param['integrarFac'])) {
            $facServi = new FacturacionService();
            foreach ($result as $index => $prod) {
                $parametro = null;
                $parametro->idindicador = $prod['idindicador'];
                $parametro->idtipoprecio = $param['idtipoprecio'];
                $ordAux = Doctrine::getTable('DatOrdenTrabajo')->find($param['idordentrabajo']);
                $parametro->idcliente = $ordAux->idcliente;
                $parametro->costo = 1;
                $parametro->servicio = 1;

                $precio = $facServi->getPrecioVentaIndicador($parametro);
                $monedaContab = $precio['datos'][$monedas->idmoneda];
                $monedaAlter = $precio['datos'][$monedas->idmonedaalternativa];
                $result[$index]['costo'] = ($monedaContab) ? $monedaContab['precioventa'] : 0;
                $result[$index]['importealternativo'] = ($monedaAlter) ? $monedaAlter['precioventa'] : 0;
                $result[$index]['datosmoneda'] = Zend_Json::encode($precio['datos']);
                if ($prod['idarea']) {
                    $area = $this->getAreaById($prod['idarea']);
                    $result[$index]['denomarea'] = $area->denominacion;
                }
                if ($prod['idcentrodecosto']) {
                    $centrodecosto = $this->getCentroDeCostoById($prod['idcentrodecosto']);
                    $result[$index]['denomcentrodecosto'] = $centrodecosto->text;
                }
            }
        }
        return array('datos' => $result, 'cantidad' => count($total));
    }

    /**
     * @param $parametros
     *
     * @return array
     */
    public function cargarArbolActividadesExistentes($parametros)
    {
        $idsExcluir = Zend_Json::decode($parametros['idsadicionados']);
        $idsExcluir = ($parametros['idsadicionados']) ? implode(',', $idsExcluir) : array();
        $denominacion = ($parametros['criterio']) ? $parametros['criterio'] : null;
        $filtro = array();
        if ($denominacion) {
            $filtro[] = array('valor' => $denominacion);
        }
        if ($parametros['idsadicionados']) {
            $filtro[] = ($parametros['idsadicionados']) ? array('notIn' => $idsExcluir) : array();
        }
        $hijos = ($parametros['hijos']) ? $parametros['hijos'] : 0;
        $result = $this->_serviciosPlanificacion->obtenerActividadyNorma(
            $parametros['nivel'], ($parametros['idservicio']) ? $parametros['idservicio'] : null, $filtro,
            ($parametros['start']) ? $parametros['start'] : 0, ($parametros['limit']) ? $parametros['limit'] : 30,
            $hijos
        );
        return $this->auxArbolActv($hijos, $parametros, $result);
    }

    private function auxArbolActv($hijos, $parametros, $result)
    {
        if ($hijos == 0) {
            $datos = $result['datos'];
            foreach ($datos as $index => $actividad) {
                $datos[$index]['text'] = $actividad['denominacion'];
                $datos[$index]['id'] = $actividad['idactividad'];
                $datos[$index]['_parent'] =
                    ($parametros['nivel'] == 3) ? $actividad['idactividad'] : $actividad['idpadre'];
                $datos[$index]['leaf'] = false;
                $datos[$index]['checked'] = false;
            }
            return $datos;
        } else {
            $datos = $result['datos'][0]['arrayhijos'];
            foreach ($datos as $index => $actividad) {
                $datos[$index]['text'] = $actividad['denominacion'];
                $datos[$index]['id'] = $actividad['idactividad'];
                $datos[$index]['_parent'] = $actividad['idpadre'];
                $datos[$index]['leaf'] = ($parametros['nivel'] == 4) ? true : false;
                $datos[$index]['checked'] = false;
            }
            return $datos;
        }
    }

    /**
     * @method devuelve las actividades de la orden de trabajo
     * @param $idOrdenTrabajo
     *
     * @return array
     */
    public function devolverActividadesOrden($idOrdenTrabajo, $params)
    {

        if ($idOrdenTrabajo) {
            $query = Doctrine_Query::create();
            $select = "ind.idindicador,ca.idactividad,ca.idindicador,a.idordenactividad, a.idactividad, coalesce(ind.numeropieza,ind.codigo)||' '||ind.denominacion as denominacion, a.fechainicio, a.fechafin,
                a.tiempoplanificado,a.idresponsable, a.observacion, a.idarea, a.idcentrodecosto, a.prioridad, a.tiemporeal,
                a.tarifahora, a.idpadre, a.costo, a.importealternativo,a.precio,a.precioalternativo,
                (SELECT COUNT(m.idmaterial ) FROM DatMaterial m WHERE m.idactividad = a.idactividad AND nrosvales IS NOT NULL AND m.idordentrabajo = {$idOrdenTrabajo}) as tienemat, ap.*,
                (CASE WHEN ca.minimo IS NOT NULL THEN ca.minimo ELSE
                (SELECT cap.minimo FROM ConfActividad cap WHERE cap.idactividad = ca.idpadre)
                END) as minimo,
                (CASE WHEN ca.maximo IS NOT NULL THEN ca.maximo ELSE
                (SELECT capp.maximo FROM ConfActividad capp WHERE capp.idactividad = ca.idpadre)
                END) as maximo,
                (CASE WHEN ca.porcentual IS NOT NULL THEN ca.porcentual ELSE
                (SELECT cappp.porcentual FROM ConfActividad cappp WHERE cappp.idactividad = ca.idpadre)
                END) as porcentual,
                (CASE WHEN ca.um IS NOT NULL THEN ca.um ELSE
                (SELECT capppp.um FROM ConfActividad capppp WHERE capppp.idactividad = ca.idpadre)
                END) as um,
                (SELECT nume.abreviaturaunidadmedida FROM NomUnidadmedida nume WHERE nume.idunidadmedida = ca.medida) as medida,
                (
                    SELECT round(sum(coalesce((ma.cantidadreal - ma.enproceso - ma.facturado) * ma.precio,0)),2)
                    FROM DatMaterial ma
                    WHERE ma.idordentrabajo = $idOrdenTrabajo AND ma.idactividad = ca.idactividad AND ma.noaplicargastoatrabajador is false
                ) as gastomaterial,
                a.pendiente, a.enproceso, a.facturado, csa.idarea, csa.idcentrodecosto, a.minutosactividad, a.tempario
                ";
            $query->select($select)->from('DatActividadOrden a')
                ->leftJoin('a.ConfActividad ca')
                ->leftJoin('a.DatActividadOrdenPersonas ap')
                ->leftJoin('ca.ConfServicioArea csa')
                ->innerJoin('ca.NomIndicador ind')
                ->where('a.idordentrabajo = ?', array($idOrdenTrabajo))
//                ->where('a.idpadre = ca.idpadre and idordentrabajo = ?', array($idOrdenTrabajo))
                ->orderBy("a.idordentrabajo DESC");
            $servicios = $this->TodoslosServicios();
            $this->configuracionHelper->getQueryJoinUnidadMedida(
                $query, 'ind', 'umedida', '(
                    CASE WHEN a.idunidadmedida IS NOT NULL THEN
                     (SELECT uma.abreviaturaunidadmedida FROM NomUnidadmedida uma WHERE uma.idunidadmedida = a.idunidadmedida)
                     ELSE umedida.abreviaturaunidadmedida END
                ) as umedida', 'leftJoin'
            );
            $this->logisticaDoctrine->addQueryLimits($query, $params);

            /*$qImp = Doctrine_Query::create()
            ->select('ot.importe')
            ->from('DatOrdenTrabajo ot')
            ->where('ot.idordentrabajo = ?', array($idOrdenTrabajo))->fetchArray();

            $qImpCUC = Doctrine_Query::create()
            ->select('ot.importealternativo')
            ->from('DatOrdenTrabajo ot')
            ->where('ot.idordentrabajo = ?', array($idOrdenTrabajo))->fetchArray();*/

            $importes = "select round(coalesce((select round(sum(coalesce(ord.costo,0)),2) from mod_logtaller.dat_ordenactividad ord
                        where ord.idordentrabajo = ot.idordentrabajo),0) +
                        coalesce((select round(sum(coalesce(dm.importecup,0)),2) from mod_logtaller.dat_material dm
                        where dm.idordentrabajo = ot.idordentrabajo),0),2) as importecup,
                        round(coalesce((select round(sum(coalesce(ord.importealternativo,0)),2) from mod_logtaller.dat_ordenactividad ord
                        where ord.idordentrabajo = ot.idordentrabajo),0) +
                        coalesce((select round(sum(coalesce(dm.importecuc,0)),2) from mod_logtaller.dat_material dm
                        where dm.idordentrabajo = ot.idordentrabajo),0),2) as importecuc
                        from mod_logtaller.dat_ordentrabajo ot
                        where ot.idordentrabajo = $idOrdenTrabajo";
            $datos = LogisticaDoctrineHelper::__init()->getConnection()->execute($importes)->fetchAll(PDO::FETCH_ASSOC);

            $result = $query->fetchArray();

            foreach ($result as $index => &$dato) {
                $this->agregarArea($dato);
                $this->agregarCentroDeCosto($dato);
            }

            return array(
                'cantidad' => $query->count(),
                'datos' => $result,
                'importes' => array('idordentrabajo' => $idOrdenTrabajo, 'importe' => $datos[0]['importecup']),
                'importesalternativos' => array('idordentrabajo' => $idOrdenTrabajo, 'importealternativo' => $datos[0]['importecuc']),
                'servicios' => $servicios['datos'],
            );
        }
        return array('cantidad' => 0, 'datos' => array());
    }

    public function insertarubicacionestall($params)
    {
        $conn = Zend_Registry::get('conexion');
        $query = "Select MAX(duto.idubicaciontallorden)
        from mod_logtaller.dat_ubicaciontallorden duto where duto.idordentrabajo = {$params->iddocumento}";
        $resultquery = $conn->fetchAll($query);
        if (count($resultquery[0]['max']) > 0) {
            $queryold = "Select duto.idubicaciontallorden,duto.fechainicio,duto.idubicaciontall 
            from mod_logtaller.dat_ubicaciontallorden duto where duto.idubicaciontallorden = {$resultquery[0]['max']}";
            $resultqueryold = $conn->fetchAll($queryold);
            array_unshift($params->datos, $resultqueryold[0]);
        };
        for ($i = 0; $i < count($params->datos); $i++) {
            if ($params->datos[$i + 1]) {
                if ($params->datos[$i]['idubicaciontall'] == $params->datos[$i + 1]['idubicaciontall']) {
                    return false;
                }
                if ($params->datos[$i]['idubicaciontallorden']) {
                    $fechasiguiente = date("d-m-Y", strtotime($params->datos[$i + 1]['fechainicio']));
                    $updateubicacion = "UPDATE 
                    mod_logtaller.dat_ubicaciontallorden 
                    SET 
                        fechafin = '{$fechasiguiente}',
                        estadia = ('{$fechasiguiente}' - fechainicio )
                    WHERE 
                    idubicaciontallorden = {$params->datos[$i]['idubicaciontallorden']}";
                    $this->doctrineHelper->getConnection()->execute($updateubicacion);
                } else {
                    $fechainicio = date("d-m-Y", strtotime($params->datos[$i]['fechainicio']));
                    $fechainiciosiguiente = date("d-m-Y", strtotime($params->datos[$i + 1]['fechainicio']));
                    $estadia = $fechainiciosiguiente - $fechainicio;
                    $sql = " INSERT INTO 
                    mod_logtaller.dat_ubicaciontallorden
                    (
                    idubicaciontall,
                    idestructuracomun,
                    idordentrabajo,
                    fechainicio,
                    fechafin,
                    estadia
                    )
                    VALUES (
                    {$params->datos[$i]['idubicaciontall']},
                    {$this->idestructuracomun},
                    {$params->iddocumento},
                    '{$fechainicio}',
                    '{$fechainiciosiguiente}',
                    '{$estadia}')   
                    ";
                    $result = $conn->fetchAll($sql);
                }
            } else {
                $fechainicio = date("d-m-Y", strtotime($params->datos[$i]['fechainicio']));
                $sql = " INSERT INTO 
                mod_logtaller.dat_ubicaciontallorden
                (
                idubicaciontall,
                idestructuracomun,
                idordentrabajo,
                fechainicio,
                fechafin,
                estadia
                )
                VALUES (
                {$params->datos[$i]['idubicaciontall']},
                {$this->idestructuracomun},
                {$params->iddocumento},
                '{$fechainicio}',
                null,
                null
                )";
                $result = $conn->fetchAll($sql);
                $sql = " UPDATE 
                mod_logtaller.dat_ordentrabajo 
                SET 
                    ubicacionactual = {$params->datos[$i]['idubicaciontall']}
                WHERE 
                idordentrabajo = {$params->iddocumento}";
                $result = $conn->fetchAll($sql);

            }
            if ($params->datos[$i]['idubicaciontall'] == 2) {
                $updateubicacion = "UPDATE 
                mod_logtaller.dat_ubicaciontallorden 
                SET 
                    fechafin = '{$fechainicio}',
                    estadia = ('{$fechainicio}' - fechainicio )
                WHERE 
                idordentrabajo = {$params->iddocumento}";
                $this->doctrineHelper->getConnection()->execute($updateubicacion);
            }
        }

        return true;
    }

    public function eliminarubicaciones($params)
    {
        $conn = Zend_Registry::get('conexion');
        $confirmacioneliminacion = "Select dut.eliminable
         from mod_logtaller.dat_ubicaciontallorden dut
         where dut.idubicaciontall = {$params}";
        if ($params == 666) {
            $sql = " DELETE FROM mod_logtaller.dat_ubicaciontallorden WHERE eliminable = 1 ";
            $this->doctrineHelper->getConnection()->execute($sql);
            $actualizarubicaciones = "UPDATE mod_logtaller.dat_ubicaciontallorden 
            SET fechafin = null, estadia = null 
            WHERE idubicaciontallentidad = (SELECT MAX(idubicaciontallentidad) 
            FROM mod_logtaller.dat_ubicaciontallorden) ";
            $this->doctrineHelper->getConnection()->execute($actualizarubicaciones);
            return true;
        }
        $flag = $conn->fetchAll($confirmacioneliminacion);
        if (count($flag)) {
            $eliminarubicacion = " DELETE FROM 
            mod_logtaller.dat_ubicaciontallorden 
          WHERE 
            idubicaciontall = {$params} and eliminable = 1 
          ";
            $this->doctrineHelper->getConnection()->execute($eliminarubicacion);
            $actualizarubicaciones = "UPDATE mod_logtaller.dat_ubicaciontallorden 
        SET fechafin = null, estadia = null 
        WHERE idubicaciontallorden = (SELECT MAX(idubicaciontallorden) 
       FROM mod_logtaller.dat_ubicaciontallorden) ";
            $this->doctrineHelper->getConnection()->execute($actualizarubicaciones);
            return true;
        } else {
            return false;
        }
    }

    public function updateubicaciones()
    {
        $conn = Zend_Registry::get('conexion');
        $sql = " UPDATE mod_logtaller.dat_ubicaciontallorden SET eliminable = null";
        $result = $conn->fetchAll($sql);
        return true;
    }

    public function devolvernomubicacionestall($todas)
    {
        $conn = Zend_Registry::get('conexion');
        $notall = 'where nut.final = 2';
        if ($todas) {
            $notall = '';
        }
        $sql = "Select *, count(1) over() as cantidad 
        from mod_logtaller.nom_ubicaciontall nut inner join mod_logtaller.dat_ubicaciontallentidad dute on dute.idubicaciontall = nut.idubicaciontall
        $notall";
        $result = $conn->fetchAll($sql);
        return array('datos' => $result, 'cantidad' => $result[0]['cantidad']);
    }

    public function devolverubicacionestall($params)
    {
        $conn = Zend_Registry::get('conexion');
        if ($params['iddocumento']) {
            $sql = " Select dut.idubicaciontall,dut.idordentrabajo,dut.fechainicio,dut.fechafin,dut.estadia,
            nut.denominacion as denominacion,dut.eliminable
            from mod_logtaller.dat_ubicaciontallorden dut
            inner join mod_logtaller.nom_ubicaciontall nut on nut.idubicaciontall = dut.idubicaciontall
            inner join mod_logtaller.dat_ordentrabajo dot on dot.idordentrabajo = dut.idordentrabajo
            where dut.idordentrabajo = {$params['iddocumento']} order by dut.fechafin desc
            ";

            $result = $conn->fetchAll($sql);
            return array('datos' => $result, 'cantidad' => $result[0]['cantidad']);
        }
    }

    /**
     * @method devuelve todos los servicios que estan en ConfActividades
     *
     * @return array|Doctrine_Query
     */
    public function TodoslosServicios()
    {
        $Allservicios = Doctrine_Query::create();
        $select = "ca.idactividad,ca.denominacion as nombreServicio";
        $Allservicios->select($select)->from('ConfActividad ca')
            ->where('idpadre is null');
        return array('datos' => $Allservicios->fetchArray());
    }

    /**
     * @method devuelve los material de asignados a la orden de trabajo o el dql correspondiente
     * @param      $idOrdenTrabajo
     * @param bool $dqlResult
     *
     * @return array|Doctrine_Query
     */
    public function devolverMaterialesOrden($idOrdenTrabajo, $dqlResult = false, $params = array())
    {
        if (!$idOrdenTrabajo) {
            return array('cantidad' => 0, 'datos' => array());

        }

        /*$nrosVale = " (Select dp.iddocumento from DatDocumentoPadre dp  WHERE dp.idpadre = m.idordentrabajo)
        as nrovale";*/

        if (!is_array($idOrdenTrabajo)) {
            $idOrdenTrabajo = array($idOrdenTrabajo);
        }
        $query = Doctrine_Query::create();
        $select = "m.idmaterial, m.idindicador, m.cantidad, m.importecuc, m.importecup, m.precio, m.precioalternativo,
                m.idunidadmedida, m.idactividad, m.estado as estado, m.idordentrabajo,
                (Case When m.aprobado is true Then 1 else 0 End) as aprobado, m.idproducto as idproducto,
                m.iddeposito as iddeposito, m.cantidadreal, m.nrosvales, m.ignorarexistencia, m.deposito,
                m.idestructuracomun as idestructuracomun, m.entidad as entidad,
                m.idoperacionm as idoperacionm, (case when idoperacionm is not null and idoperacionm = 1 then 'Reservar material'
                when idoperacionm = 2 then 'Solicitar material' else '-' end) as operacion
                , (SELECT coalesce(a.numeropieza,a.codigo)||' '||a.denominacion as denominacion
                FROM NomIndicador a
                WHERE a.idindicador = ca.idindicador
                LIMIT 1
                ) as denominacionactividad,
                (CASE WHEN ddcl.iddocumento is not null THEN 1 ELSE 0 END) as capacidadliquida,
                m.pendiente, m.enproceso, m.facturado, (Case When m.noaplicargastoatrabajador is true Then 1 else 0 End) as noaplicargastoatrabajador";
        $query->select($select)->from('DatMaterial m')
            ->leftJoin("m.DatOrdenTrabajo dot on dot.idordentrabajo = m.idordentrabajo")
            ->leftJoin("dot.DatDocumento dd on dot.idordentrabajo = dd.iddocumento")
            ->leftJoin("dd.DatDocumentocl ddcl on ddcl.iddocumento = dd.iddocumento")
            ->whereIn('m.idordentrabajo', $idOrdenTrabajo)->orderBy(
                "m.idordentrabajo DESC");
        $mproducto = new MaestroProductoModel();
        $query->innerJoin('m.NomIndicador ind')->addSelect("ind.denominacion as denominacion,
               (case when ind.numeropieza is null or length(ind.numeropieza) = 0 then ind.codigo else ind.numeropieza end) as codigo");
        $query->innerJoin('m.ConfActividad ca');
        $mproducto->addQueryJoinIndicadorHoja($query, 'ind', 'indh', 1);

        $mproducto->addQueryJoinMarcaModelo($query, 'indh', 'nmar', 'nm', true, true, 'ind');
        $mproducto->configuracionHelper->getQueryJoinUnidadMedida(
            $query, 'm', 'umedida', 'umedida.abreviaturaunidadmedida as nomunidamedida', 'leftJoin'
        );
        if ($params['criterio']) {
            $query->andWhere("ind.numeropieza ilike '%{$params['criterio']}%' or ind.codigo ilike '%{$params['criterio']}%' or ind.denominacion ilike '%{$params['criterio']}%'");
        }
        if ($params['aprobado']) {
            $query->andWhere('m.aprobado = ? ', array($params['aprobado']));
        }
        if ($params['estado']) {
            $query->andWhere('m.estado = ? ', array($params['estado']));
        }
        if ($params['vales']) {
            $query->andWhere('m.cantidadreal < m.cantidad');
        }
        if ($params['iddeposito']) {
            $query->andWhere('m.iddeposito = ?', array($params['iddeposito']));
        }
        if ($params['idproducto']) {
            $query->andWhere('m.idproducto = ?', array($params['idproducto']));
        }
        if ($params['idactividad']) {
            $query->andWhere('ind.idactividad = ?', array($params['idactividad']));
        }
        $conf = LogisticaDoctrineHelper::__init()->getConnection()->execute(
            "select ct.centrocostosporactividad from mod_logtaller.conf_talleres ct where ct.idestructuracomun = {$this->idestructuracomun}"
        )->fetchAll(PDO::FETCH_ASSOC);

        if (count($conf) && $conf[0]['centrocostosporactividad'] && $params['idcentrocosto']) {
            $relations[] = array(
                'cardinalidad' => 'one', 'relation' => 'DatActividadOrden',
                'properties' => array('local' => 'idactividad', 'foreign' => 'idactividad'),
            );
            $this->doctrineHelper->tryInyectRelactions(new DatMaterial, $relations);
            $query->innerJoin('m.DatActividadOrden act');
            $query->andWhereIn('act.idordentrabajo', $idOrdenTrabajo);
            $query->andWhere('act.idcentrodecosto = ?', array($params['idcentrocosto']));
            if ($params['idordenactividad']) {
                $query->andWhere('act.idordenactividad = ?', array($params['idordenactividad']));
            }
        }
        $config = new ConfiguracionTalleresModel();
        $config->getOrdenByConfig($query, 'idmaterial');
        if ($dqlResult) {
            return $query;
        } else {
            $datos = $this->logisticaDoctrine->addQueryLimits($query, $params)->fetchArray();
            $datos = $this->completeData($datos, $idOrdenTrabajo[0], $params['aprobado']);
            $this->updateDatosMateriasles($idOrdenTrabajo[0]);

            return array('cantidad' => $query->count(), 'datos' => $datos);
        }

    }

    private function getSqlDatosOrden($idOrdenTrabajo)
    {
        return "select
            m.idproducto, sum( m.cantidad) as entregado, sum(round(m.cantidad*m.preciocontable,2)) as importecup,
            sum(round(m.cantidad*m.precioalternativo,2)) as importecuc,
            coalesce((
                select sum(m2.cantidad)
                from mod_logistica.dat_movimiento m2
                inner join mod_logistica.dat_documento d2 on d2.iddocumento = m2.iddocumento
                left join mod_loginventario.dat_movdevolucion dme1 on dme1.idmovimiento = m2.idmovimiento
                where m2.iddocumento in (
                    select iddocumento
                    from mod_logistica.dat_documentopadre where idpadre in (
                        select iddocumento
                          from mod_logistica.dat_documentopadre where idpadre = {$idOrdenTrabajo}
                    )
                )
                and m2.idproducto = m.idproducto
                and d2.estado = 4
                and (case when dme1.idordenactividad is not null then
                  dmat.idactividad in (select ordact1.idactividad from mod_logtaller.dat_ordenactividad ordact1 where ordact1.idordenactividad = dme1.idordenactividad)
                else true end)
            ),0) as devuelto,
            (
                select string_agg('VE-' || dg.nrodoc,', ') from mod_logistica.dat_documento dg
                inner join mod_logistica.dat_movimiento dgm on dgm.iddocumento = dg.iddocumento
                left join mod_loginventario.dat_moventrega dme1 on dme1.idmovimiento = dgm.idmovimiento
                inner join mod_logistica.dat_documentopadre dgp on dgp.iddocumento = dg.iddocumento
                where dgm.idproducto = m.idproducto and dgp.idpadre = {$idOrdenTrabajo} and dg.estado = 4
                and (case when dme1.idordenactividad is not null then
                  dmat.idactividad in (select ordact1.idactividad from mod_logtaller.dat_ordenactividad ordact1 where ordact1.idordenactividad = dme1.idordenactividad)
                else true end)
            ) as numerosvales,
            (
                select string_agg('VD-' || dg.nrodoc,', ') from mod_logistica.dat_documento dg
                inner join mod_logistica.dat_movimiento dgm on dgm.iddocumento = dg.iddocumento
                left join mod_loginventario.dat_movdevolucion dme1 on dme1.idmovimiento = dgm.idmovimiento
                inner join mod_logistica.dat_documentopadre dgp on dgp.iddocumento = dg.iddocumento
                inner join mod_logistica.dat_documentopadre dgpp on dgpp.iddocumento = dgp.idpadre
                where dgm.idproducto = m.idproducto and dgpp.idpadre = {$idOrdenTrabajo} and dg.estado = 4
                and (case when dme1.idordenactividad is not null then
                  dmat.idactividad in (select ordact1.idactividad from mod_logtaller.dat_ordenactividad ordact1 where ordact1.idordenactividad = dme1.idordenactividad)
                else true end)
            ) as numerosvalesdev,
            (
                select string_agg('PED-' || dd1.nrodoc,', ') from mod_logistica.dat_documento dg
                inner join mod_logistica.dat_documentopadre dp on dp.iddocumento = dg.iddocumento
                inner join mod_logistica.dat_documento dd on dd.iddocumento = dp.idpadre
                inner join mod_logistica.dat_documentopadre dp1 on dp1.idpadre = dd.iddocumento
                inner join mod_logistica.dat_documento dd1 on dd1.iddocumento = dp1.iddocumento
                inner join mod_logdistribucion.dat_productopedido dgm on dgm.idpedido = dd1.iddocumento
                where /*dgm.idproducto = m.idproducto and*/ dg.iddocumento = {$idOrdenTrabajo} and dd1.estado = 3
            ) as numerospedcita,
            (
                select string_agg('PED-' || dd.nrodoc,', ') from mod_logistica.dat_documento dg
                inner join mod_logistica.dat_documentopadre dp on dp.idpadre = dg.iddocumento
                inner join mod_logistica.dat_documento dd on dd.iddocumento = dp.iddocumento
                inner join mod_logdistribucion.dat_productopedido dgm on dgm.idpedido = dd.iddocumento
                where /*dgm.idproducto = m.idproducto and*/ dg.iddocumento = {$idOrdenTrabajo} and dd.estado = 3
            ) as numerospedorden,
            coalesce((
                select sum(round(m2.cantidad*m2.preciocontable,2))
                from mod_logistica.dat_movimiento m2
                inner join mod_logistica.dat_documento d2 on d2.iddocumento = m2.iddocumento
                left join mod_loginventario.dat_movdevolucion dme1 on dme1.idmovimiento = m2.idmovimiento
                where m2.iddocumento in (
                    select iddocumento
                    from mod_logistica.dat_documentopadre where idpadre in (
                        select iddocumento
                          from mod_logistica.dat_documentopadre where idpadre = {$idOrdenTrabajo}
                    )
                )
                and m2.idproducto = m.idproducto
                and d2.estado = 4
                and (case when dme1.idordenactividad is not null then
                  dmat.idactividad in (select ordact1.idactividad from mod_logtaller.dat_ordenactividad ordact1 where ordact1.idordenactividad = dme1.idordenactividad)
                else true end)
            ),0) as devueltocup,
            coalesce((
                select sum(round(m2.cantidad*m2.precioalternativo,2))
                from mod_logistica.dat_movimiento m2
                inner join mod_logistica.dat_documento d2 on d2.iddocumento = m2.iddocumento
                where m2.iddocumento in (
                    select iddocumento
                    from mod_logistica.dat_documentopadre where idpadre in (
                        select iddocumento
                          from mod_logistica.dat_documentopadre where idpadre = {$idOrdenTrabajo}
                    )
                )
                and m2.idproducto = m.idproducto
                and d2.estado = 4
            ),0) as devueltocuc,
			coalesce(( select sum(m2.cantidad)
			from mod_logistica.dat_movimiento m2 inner join mod_logistica.dat_documento d2 on d2.iddocumento = m2.iddocumento
			where m2.iddocumento in ( select iddocumento from mod_logistica.dat_documentopadre where idpadre = {$idOrdenTrabajo} ) and
			m2.idproducto = m.idproducto and d2.estado = 7 ),0) as anulado, ( select string_agg('VE(A)-' || dg.nrodoc,', ')
			from mod_logistica.dat_documento dg inner join mod_logistica.dat_movimiento dgm on dgm.iddocumento = dg.iddocumento
			inner join mod_logistica.dat_documentopadre dgp on dgp.iddocumento = dg.iddocumento where dgm.idproducto = m.idproducto
			and dgp.idpadre = {$idOrdenTrabajo} and dg.estado = 7 ) as valesanulados,  coalesce(( select sum(round(m2.cantidad*m2.preciocontable,2))
			from mod_logistica.dat_movimiento m2 inner join mod_logistica.dat_documento d2 on d2.iddocumento = m2.iddocumento
			where m2.iddocumento in ( select iddocumento from mod_logistica.dat_documentopadre where idpadre = {$idOrdenTrabajo} )
			and m2.idproducto = m.idproducto and d2.estado = 7 ),0) as anuladocup,
			coalesce(( select sum(round(m2.cantidad*m2.precioalternativo,2)) from mod_logistica.dat_movimiento m2
			inner join mod_logistica.dat_documento d2 on d2.iddocumento = m2.iddocumento where m2.iddocumento in (
			select iddocumento from mod_logistica.dat_documentopadre where idpadre = {$idOrdenTrabajo} )
			 and m2.idproducto = m.idproducto and d2.estado = 7 ),0) as anuladocuc,dmat.idmaterial
            from mod_logistica.dat_movimiento m
            inner join mod_logistica.dat_documento d on d.iddocumento = m.iddocumento
            left join mod_loginventario.dat_moventrega dme on dme.idmovimiento = m.idmovimiento
            left join mod_logtaller.dat_material dmat on dmat.idordentrabajo = {$idOrdenTrabajo} and dmat.idproducto = m.idproducto
            where m.iddocumento in (
                select iddocumento
                from mod_logistica.dat_documentopadre where idpadre = {$idOrdenTrabajo}
            )
            and d.estado in (4,7) and (case when dme.idordenactividad is not null then
              dmat.idactividad in (select ordact.idactividad from mod_logtaller.dat_ordenactividad ordact where ordact.idordenactividad = dme.idordenactividad)
            else true end)
            group by m.idproducto,dmat.idmaterial";
    }

    /*public function updateDatosMateriasles($idOrdenTrabajo)
    {
    if(is_array($idOrdenTrabajo)){
    foreach($idOrdenTrabajo as $id){
    $sql = "update mod_logtaller.dat_material d
    set cantidadreal = q.entregado - q.devuelto,
    importecup = q.importecup - q.devueltocup,
    importecuc = q.importecuc - q.devueltocuc,
    nrosvales = coalesce(q.numerosvales,'') ||' '|| coalesce(q.numerosvalesdev,'')
    from (
    {$this->getSqlDatosOrden($id)}
    )q
    where d.idmaterial = q.idmaterial";
    LogisticaDoctrineHelper::__init()->getConnection()->execute($sql);
    }
    }else{
    $sql = "update mod_logtaller.dat_material d
    set cantidadreal = q.entregado - q.devuelto,
    importecup = q.importecup - q.devueltocup,
    importecuc = q.importecuc - q.devueltocuc,
    nrosvales = coalesce(q.numerosvales,'') ||' '|| coalesce(q.numerosvalesdev,'')
    from (
    {$this->getSqlDatosOrden($idOrdenTrabajo)}
    )q
    where d.idmaterial = q.idmaterial";
    //echo $sql;die;
    LogisticaDoctrineHelper::__init()->getConnection()->execute($sql);
    }
    }*/

    public function updateDatosMateriasles($idOrdenTrabajo)
    {
        if (is_array($idOrdenTrabajo)) {
            foreach ($idOrdenTrabajo as $id) {
                $sql = "update mod_logtaller.dat_material d
                set cantidadreal = q.entregado - q.devuelto - q.anulado,
                    importecup = q.importecup - q.devueltocup - q.anuladocup,
                    importecuc = q.importecuc - q.devueltocuc - q.anuladocuc,
                    nrosvales = coalesce(q.numerosvales,'') ||' '|| coalesce(q.numerosvalesdev,'') ||' '|| coalesce(q.valesanulados,'') ||' '|| coalesce(q.numerospedcita,'') ||' '|| coalesce(q.numerospedorden,'')
                from (
                {$this->getSqlDatosOrden($id)}
                )q
                where d.idmaterial = q.idmaterial";
                LogisticaDoctrineHelper::__init()->getConnection()->execute($sql);
            }
        } else {
            $sql = "update mod_logtaller.dat_material d
            set cantidadreal = q.entregado - q.devuelto - q.anulado,
                importecup = q.importecup - q.devueltocup - q.anuladocup,
                importecuc = q.importecuc - q.devueltocuc - q.anuladocuc,
                nrosvales = coalesce(q.numerosvales,'') ||' '|| coalesce(q.numerosvalesdev,'') ||' '|| coalesce(q.valesanulados,'') ||' '|| coalesce(q.numerospedcita,'') ||' '|| coalesce(q.numerospedorden,'')
            from (
            {$this->getSqlDatosOrden($idOrdenTrabajo)}
            )q
            where d.idmaterial = q.idmaterial";
            //echo $sql;die;
            LogisticaDoctrineHelper::__init()->getConnection()->execute($sql);
        }

    }

    private function completeData($queryResult, $idOrdenTrabajo, $aprobado)
    {
        $total = LogisticaDoctrineHelper::__init()->getConnection()->execute($this->getSqlDatosOrden($idOrdenTrabajo))
            ->fetchAll(PDO::FETCH_ASSOC);
        foreach ($queryResult as $pos => $material) {
            foreach ($total as $item) {
                if ($item['idmaterial'] == $material['idmaterial']) {
                    $queryResult[$pos]['cantidadreal'] = $item['entregado'] - $item['devuelto'] - $item['anulado'];
                    $queryResult[$pos]['importecup'] = $item['importecup'] - $item['devueltocup'] - $item['anuladocup'];
                    $queryResult[$pos]['importecuc'] = $item['importecuc'] - $item['devueltocuc'] - $item['anuladocuc'];
                    $queryResult[$pos]['nrosvales'] = $item['numerosvales'] . '  ' . $item['numerosvalesdev'] . '  ' . $item['valesanulados'] . '  ' . $item['numerospedcita'] . '  ' . $item['numerospedorden'];
                    $queryResult[$pos]['cantidad'] = ($aprobado) ? $queryResult[$pos]['cantidadreal'] : $queryResult[$pos]['cantidad'];
                    break;
                }
            }
        }
        return $queryResult;
    }

    public function getJoinMedioOrdenConMarcaModelo($dql, $aliasMed = 'med', $aliasMarc = 'nmar', $aliasMod = 'nm')
    {
        $mproducto = new MaestroProductoModel();
        $dql->innerJoin("{$aliasMed}.NomIndicador indd");
        $mproducto->addQueryJoinIndicadorHoja($dql, 'indd', 'indh', 1);
        $mproducto->configuracionHelper->getQueryJoinUnidadMedida(
            $dql, 'indd', 'umedida', 'umedida.abreviaturaunidadmedida as umedida', 'leftJoin'
        );
        $mproducto->addQueryJoinMarcaModelo($dql, 'indh', $aliasMarc, $aliasMod, true, true, 'indd');
        return $dql;
    }

    public function getJoinOrdenTrabajoConPedido($dql, $aliasPedido = 't', $aliasDocOrigen = 'ddl')
    {
        $dql->innerJoin("{$aliasPedido}.DatPedidoOrdenTrabajo dpot")->innerJoin("dpot.DatOrdenTrabajo dot")->innerJoin(
            "dot.DatDocumento {$aliasDocOrigen}"
        )->leftJoin("dot.DatMedio med")->leftJoin('med.NomIndicador ind')->innerJoin('ind.NomIndicadorhoja indh')
            ->addSelect(
                "{$aliasDocOrigen}.nrodoc as nrodocorigen,{$aliasDocOrigen}.iddocumento as iddocumentoorigen,
                 {$aliasDocOrigen}.numeroref as numeroreforig,dot.atributoidentificador as atributoidentificador,
                 med.idindicador as idindicador, med.idproducto as idproducto "
            );
        $maestro = new MaestroProductoModel();
        $maestro->addQueryJoinMarcaModelo($dql, 'indh', 'nmar', 'nm', true, true, 'ind');
        return $dql;
    }

    /**
     * @method devuelve los materiales existentes en los almacenes
     * @return mixed
     * @throws Zend_Exception
     */
    public function devolverMaterialesExistentes($parametros)
    {
        $idestructura = (isset($parametros['idestructuracomun']) && $parametros['idestructuracomun'])
            ? $parametros['idestructuracomun']
            : $this->global->Estructura->idestructura;
        $idsDeposit = $this->seguridadHelper->obtenerEstructurasNoFormales($this->global->Perfil->certificado, 8);
        $depositos = $this->estructuraHelper->obtenerEstructurasNoFormales(
            false, $idestructura, false, null, null, $idsDeposit, -1
        );
        $datosDepositos = array();
        if ($depositos) {
            foreach ($depositos as $i => $r) {
                $datosDepositos[] = $r['DatEstructuraop'][0]['idestructuraop'];
            }
            $depositos = implode(',', $datosDepositos);
            $sql = "select DISTINCT  p.idindicador, i.denominacion, (case when i.numeropieza is null or length(i.numeropieza) = 0 then i.codigo else i.numeropieza end) as codigo , p.idumedida as idunidadmedida ,
               1 as cantplanif, p.precio as precioventa, p.precioalternativo as precioalternativo,
               um.abreviaturaunidadmedida as denominacionunidadmedida, i.numeropieza as codigoproveedor,
               (p.cantidad - (select coalesce(sum(cantidad),0) from mod_logistica.dat_cantidadcomprometida
                                                 where estado = 1 and idproducto = p.idproducto)) as disponible,
               op.denominacion as deposito, p.idestructura as iddeposito, ent.denominacion as entidad, p.idestructuracomun as idestructuracomun, p.idproducto,
               'data:image/jpg;base64,'||img.imagen as imagen
               from mod_logistica.dat_producto p
               INNER JOIN mod_datosmaestros.nom_indicador i on p.idindicador = i.idindicador
               left join mod_datosmaestros.dat_imagenindicador dimg on dimg.idindicador = i.idindicador
               left join mod_logistica.nom_imagen img on img.idimagen = dimg.idimagen
               LEFT JOIN mod_datosmaestros.nom_unidadmedida um on p.idumedida = um.idunidadmedida
               left join mod_estructuracomp.dat_estructuraop op on op.idestructuraop = p.idestructura
               left join mod_estructuracomp.dat_estructuraop ent on ent.idestructuraop = p.idestructuracomun
			   where p.idestructuracomun = {$idestructura} and p.idestructura in ({$depositos})
              ";
        } else {
            throw new ZendExt_Exception('LOG_T_007');
        }

        if ($parametros['criterio']) {
            //if (is_numeric($parametros['criterio'])) {
            $sql = $sql . " and ( i.codigo  ilike '%{$parametros['criterio']}%' ";
            //} else {
            $sql = $sql . " or i.denominacion  ilike '%{$parametros['criterio']}%' ";
            $sql = $sql . " or i.numeropieza  ilike '%{$parametros['criterio']}%' )";
            //}
        }
        if ($parametros['codigoproveedor']) {
            $sql = $sql . " and i.numeropieza  ilike '%{$parametros['codigoproveedor']}%' ";
        }
        if ($parametros['codigo']) {
            $sql = $sql . " and i.codigo  ilike '%{$parametros['codigo']}%' ";
        }
        if ($parametros['denominacion']) {
            $sql = $sql . " and i.denominacion  ilike '%{$parametros['denominacion']}%' ";
        }
        if ($parametros['deposito']) {
            $sql = $sql . " and op.denominacion  ilike '%{$parametros['deposito']}%' ";
        }
        if ($parametros['excluir']) { //los ids separados por coma (###,###)
            $excluir = explode(",", $parametros['excluir']);
            foreach ($excluir as $prod) {
                if (is_numeric($prod)) {
                    $arrExcluir[] = $prod;
                }

            }
            $parametros['excluir'] = implode(',', $arrExcluir);

            $parametros['excluir'] = str_replace('undefined', '-1', $parametros['excluir']);
            $sql .= " and p.idproducto not in ({$parametros['excluir']})";
        }

        $conn = Zend_Registry::get('conexion');
        $cantidadTotal = count($conn->fetchAll($sql));
        if ($parametros['limit']) {
            $sql = $sql . "LIMIT {$parametros['limit']} ";
        }
        if ($parametros['start']) {
            $sql = $sql . "OFFSET {$parametros['start']} ";
        }
        $result = $conn->fetchAll($sql);
        /*$monedas = LogisticaGlobal::__init()->getMonedaEntidad();
        if ($this->_aperturaFAC && Zend_Json::decode($parametros['integrarfacturacion'])) {
        $facServi = new FacturacionService();
        foreach ($result as $index => $prod) {
        $param = null;
        $param->idindicador = $prod['idindicador'];
        $param->idtipoprecio = $parametros['idtipoprecio'];
        $param->idestructuraop = $prod['iddeposito'];

        $precio = $facServi->getPrecioVentaIndicador($param);
        $monedaContab = $precio['datos'][$monedas->idmoneda];
        $monedaAlter = $precio['datos'][$monedas->idmonedaalternativa];
        $result[$index]['precioventa'] = ($monedaContab) ? $monedaContab['precioventa'] : 0;
        $result[$index]['precioalternativo'] = ($monedaAlter) ? $monedaAlter['precioventa'] : 0;
        $result[$index]['datosmoneda'] = Zend_Json::encode($precio['datos']);
        }
        }*/
        return array('datos' => $result, 'cantidad' => $cantidadTotal);
    }

    /**
     * @method adiciona la reclamacion a la orden de trabajo
     * @param $parametros
     */
    public function adicionarReclamacion($parametros)
    {
        $objReclamacion = new DatOrdenReclamacion();
        $objReclamacion->idordentrabajo = $parametros['idordentrabajo'];
        $objReclamacion->fechareclamacion = $parametros['fechareclamacion'];
        $objReclamacion->descripcion = $parametros['reclamacion'];
        $objReclamacion->posecionmedio = $parametros['posecionmedio'];
        $objReclamacion->save();
        $doc = Doctrine::getTable('DatOrdenTrabajo')->find($parametros['idordentrabajo']);
        $doc->cantidadreclamaciones = ($doc->cantidadreclamaciones) ? $doc->cantidadreclamaciones + 1 : 1;
        $doc->save();
    }

    /**
     * @method devuelve las reclamaciones de la orden de trabajo
     * @param $parametros
     *
     * @return array
     */
    public function cargarReclamacionesOrden($parametros)
    {
        $parametros['id'] = ($parametros['idordentrabajo']) ? $parametros['idordentrabajo'] : $parametros['id'];
        if ($parametros['id']) {
            $query = Doctrine_Query::create();
            $query->select('r.idordenreclamacion, r.fechareclamacion, r.posecionmedio, r.descripcion ')->from(
                'DatOrdenReclamacion r'
            )->where('r.idordentrabajo = ?', array($parametros['id']))->orderBy("r.idordenreclamacion DESC");
            if ($parametros['criterio']) {
                $query->andWhere("r.descripcion ilike '%{$parametros['criterio']}%'");
            }
            return array('cantidad' => $query->count(), 'datos' => $query->fetchArray());
        }
        return array('cantidad' => 0, 'datos' => array());
    }

    /**
     * @method devuelve las monedas contables de la entidad
     * @return array
     */
    public function devolverMonedasContables()
    {
        $result = $this->_serviciosConfiguracionGeneral->obtenerMonedaContablePorEntidad(
            $this->global->Estructura->idestructura
        );
        return array('codigoiso' => $result->codigoiso);
    }

    /**
     * @method devuelve las monedas contables de la entidad
     * @return array
     */
    public function devolverMonedasAlternativa()
    {
        $result = $this->_serviciosConfiguracionGeneral->obtenerMonedasAlternativasPorEntidad(
            $this->global->Estructura->idestructura
        )['datos'];
        $codigoISO = null;
        foreach ($result as $mon) {
            if ($mon['dualidad'] == 1) {
                $codigoISO = $mon['codigoiso'];
                break;
            }
        }
        return array('codigoiso' => $codigoISO);
    }

    /**
     * @method devuelve las posibles fallas configuradas al tipo de medio
     * @param $parametros
     *
     * @return array
     */
    public function cargarPosiblesFallasDelMedio($parametros)
    {
        $query = Doctrine_Query::create();
        $query->select('nfm.idfalla, nfm.denominacion, nfm.estado, nfm.soluciones, nfm.idproducto ')->from(
            'NomFallasMedios nfm'
        )->innerJoin('nfm.DatFallasMediosEntidad dfme ')->where(
            'dfme.idestructuracomun = ?', array($this->global->Estructura->idestructura)
        )->andWhere('nfm.idproducto = ?', array($parametros['idproducto']));
        if ($parametros['excluir']) {
            $query->andWhereNotIn('nfm.idfalla ', array($parametros['excluir']));
        }
        $query->orderBy("nfm.denominacion DESC");
        if ($parametros['criterio']) {
            $query->andWhere("nfm.denominacion ilike '%{$parametros['criterio']}%'");
        }
        if ($parametros['start']) {
            $query->offset($parametros['start']);
        }
        if ($parametros['limit']) {
            $query->limit($parametros['limit']);
        }
        return array('cantidad' => $query->count(), 'datos' => $query->fetchArray());
    }

    /**
     * @method devuelve las fallas registradas en la orden de trabajo
     * @param $parametros
     *
     * @return array
     */
    public function cargarFallasDetectadasAlMedio($parametros)
    {
        $parametros['idordentrabajo'] = ($parametros['idordentrabajo']) ? $parametros['idordentrabajo'] : 1;
        $query = Doctrine_Query::create();
        $query->select(
            'nfm.idfalla as idfalla, nfm.denominacion as denominacion, nfm.estado as estado,
            nfm.soluciones as solucion, nfm.idproducto as id producto,
            fot.idfallasordentrabajo as idfallasordentrabajo'
        )->from('DatFallasOrdenTrabajo fot')->innerJoin('fot.NomFallasMedios nfm ')->where(
            'fot.idordentrabajo = ?', array($parametros['idordentrabajo'])
        )->orderBy("nfm.denominacion DESC");
        if ($parametros['criterio']) {
            $query->andWhere("nfm.denominacion ilike '%{$parametros['criterio']}%'");
        }
        $this->logisticaDoctrine->addQueryLimits($query, $parametros);
        return array('cantidad' => $query->count(), 'datos' => $query->fetchArray());
    }

    /**
     * @method devule el indicador y la cantidad existente del mismo
     * @param $parametros
     *
     * @return array
     * @throws Zend_Exception
     */
    public function comprobarExistenciaMaterial($idsIndicador)
    {
        $conn = Zend_Registry::get('conexion');
        $total = array();
        foreach ($idsIndicador as $idindicador) {
            $sql = "select p.idindicador,sum(p.cantidad - (select coalesce(sum(cantidad),0)
                                                 from mod_logistica.dat_cantidadcomprometida
                                                 where estado = 1 and idproducto = p.idproducto)) as cantidad
                from mod_logistica.dat_producto p
                where p.idestructuracomun = {$this->idestructuracomun} and p.idindicador = $idindicador
                and p.cronologia > 0
                group by p.idindicador, p.idestructura";
            $instancia = $conn->fetchAll($sql);
            if (count($instancia) > 0) {
                $total[] = $instancia[0];
            }
        }
        return $total;
    }

    public function comprobarExistenciaTotalOrden($parametros)
    {
        $ids = array();
        $query = Doctrine_Query::create();
        $query->select('m.idindicador as idindicador, m.cantidad as cantidad, m.idmaterial as idmaterial')->from(
            'DatMaterial m'
        )->where('m.idordentrabajo = ? and m.ignorarexistencia = 0 and m.estado = 1', array($parametros));
        $conFaltante = $query->fetchArray();
        $objOrdenTrabajo = new DatOrdenTrabajo();
        $objOrdenTrabajo->assignIdentifier($parametros);
        if (count($conFaltante) > 0) {
            $objOrdenTrabajo->estadoorden = 1;
            $objOrdenTrabajo->save();
            return 1;
        } else {
            $objOrdenTrabajo->estadoorden = 0;
            $objOrdenTrabajo->save();
            return 0;
        }
        /* foreach ($guardados as $indicador) {
    $ids['ids'][] = $indicador['idindicador'];
    $ids['cantidad'][] = $indicador['cantidad'];
    $ids['idsmaterial'][] = $indicador['idmaterial'];
    }
    $ids['idorden'] = $parametros;
    return $this->compararExistenciaNecesidad($ids);*/
    }

    private function compararExistenciaNecesidad($param)
    {
        $totales = $this->comprobarExistenciaMaterial($param['ids']);
        $arrFaltantes = array();
        foreach ($param['ids'] as $index => $indicador) {
            $find = false;
            foreach ($totales as $dato) {
                if ($dato['idindicador'] == $indicador) {
                    $find = true;
                    if ($dato['cantidad'] < $param['cantidad'][$index]) {
                        $arrFaltantes[] = $param['idsmaterial'][$index];
                    }
                }
            }
            if (!$find) {
                $arrFaltantes[] = $indicador;
            }
        }
        $objOrdenTrabajo = new DatOrdenTrabajo();
        $objOrdenTrabajo->assignIdentifier($param['idorden']);
        if (count($arrFaltantes) > 0) {
            $objOrdenTrabajo->estadoorden = 1;
            $objOrdenTrabajo->save();
            return 1;
        } else {
            $objOrdenTrabajo->estadoorden = 0;
            $objOrdenTrabajo->save();
            return 0;
        }
    }

    /**
     * devuleve las estructuras no formales del dominio
     *
     * @return stdClass
     */
    public function cargarEstructurasNoFormalesInternas()
    {
        $areasTall = $this->_serviciosEstructuraComp->obtenerEstructurasNoFormales(
            $this->global->Perfil->iddominio, null, null, null, 0, null, -3
        );
        return $areasTall;
    }

    /**
     * "descripcion devuleve las areas del los talleres de la estructura por la q se entrö.
     *
     * @param $params
     *
     * @return mixed
     * @throws Exception
     */
    public function cargarAreasTallerPorSubordinacion($params)
    {
        $start = ($params['start']) ? $params['star'] : 0;
        $limit = ($params['limit']) ? $params['limit'] : 1000;
        $subd = $this->_serviciosEstructuraComp->obtenerSubordinaciones("ATall", $limit, $start);
        $idsub = (count($subd)) ? $subd[0]['idnomsubordinacion'] : null;
        if ($idsub) {
            $areasTall = $this->_serviciosEstructuraComp->buscarHijoPorSubordinacion(
                $this->global->Estructura->idestructura, array($idsub), null
            );
        } else {
            throw new Exception("Debe configurar la subordinaciÃ³n para las Ã¡reas del taller de la entidad actual");
        }
        return $areasTall;
    }

    /**
     * @method devuelve las Ordenes de Trabajo en estado Cerrado.
     * @param array $parametros
     *
     * @return array
     */
    public function cargarOrdenesTrabajoCerradas($parametros = array())
    {
        $selectOrden = 'ord.idordentrabajo as idordentrabajo, ord.fechainicio as fechainicio, '
            . 'ord.fechacierre as fechacierre,ord.dictamentecnico as dictamentecnico, ord.garantia as garantia, '
            . 'ord.fechafin as fechafin, ord.idcliente as idclientesproveedores, ord.fallascliente as fallascliente, '
            . 'ord.iddocumentoorigen as iddocumentoorigen, ord.idtecnico as idtecnico '
            . 'ord.importe as importe';
        $parametros['idestructura'] = $this->idestructuracomun;
        $parametros['estado'] = EstadoDocumentoModel::ESTADO_CERRADO;
        $parametros['clienteorden'] = 1;
        if ($parametros['mayorista']) {
            $filtro['mayorista'] = 1;
            $clMayoristasAux = $this->configuracionHelper->getClientesProveedorByParams(
                false, $this->global->Estructura->idestructura, true,
                true, false, $filtro, null, null
            )['datos'];
            $clMayoristas = LogisticaObjectHelper::__init()
                ->extractValueFromArrayColumn($clMayoristasAux, 'idclientesproveedores');
            if (!count($clMayoristas)) {
                $clMayoristas = array(-1);
            }
            $parametros['idcliente'] = $clMayoristas;
        }
        $dql = parent::devolverDocumentos($parametros);
        $dql->innerJoin('d.DatOrdenTrabajo ord')->addSelect($selectOrden);
        if (!$parametros['comprobante']) {
            $dql->innerJoin('ord.DatTrabajoServicio ts');
            $dql->addSelect('ts.idservicio as idservicio');
        }
        if ($parametros['docorigenexcluir']) {
            $dql->andWhereNotIN("ord.documentoorigen", $parametros['docorigenexcluir']);
        }
        if ($parametros['notIn']) {
            $dql->andWhereNotIn('ord.idordentrabajo', $parametros['notIn']);
        }
        if ($parametros['facturacion']) {
            $dql->andWhere('ord.garantia = ?', array(0));
            /*$dql->addWhere('((
        SELECT COUNT(dao.idordenactividad) FROM DatActividadOrden dao WHERE dao.idordentrabajo = ord.idordentrabajo
        AND dao.pendiente > 0
        )+
        (
        SELECT COUNT(dm.idmaterial) FROM DatMaterial dm WHERE dm.idordentrabajo = ord.idordentrabajo
        AND dm.pendiente > 0
        )) > 0');*/
        }
        if ($parametros['fechacierre']) {
            $dql->andWhere('ord.fechacierre <= ?', array($parametros['fechacierre']));
        }
        if ($parametros['comprobante']) {
            $dql->addSelect('ord.fechacierre as fechacontable');
            $dql->addSelect("coalesce(ROUND(
                        coalesce((SELECT ROUND(SUM(coalesce(dm.importecup,0)),2) FROM DatMaterial dm
                        WHERE dm.idordentrabajo = ord.idordentrabajo),0),2),0) as importetotal");
            $dql->andWhere('d.idcomprobante IS NULL');
        }
        $cantidad = $dql->count();
        $data = $this->logisticaDoctrine->addQueryLimits($dql, $parametros)->fetchArray();
        if ($parametros['comprobante']) {
            $this->cargarClientesDocumentos($data);
            return array("datos" => $data, "cantidad" => $cantidad);
        }
        $data = $this->auxiliarCargarOrdenesTrabajoCerradas($data);
        return array("datos" => $data, "cantidad" => $cantidad);
    }

    private function auxiliarCargarOrdenesTrabajoCerradas($data)
    {
        foreach ($data as $index => $orden) {
            $materialesEnActividad = [];
            $materialesSinActividad = [];
            $selectMateriales = "mt.cantidad, mt.importecup, mt.idunidadmedida,
            mt.idindicador, mt.idactividad, mt.idordentrabajo";
            $materiales = Doctrine_Query::create()->from("DatMaterial mt")->select($selectMateriales)->where(
                "mt.idordentrabajo = ?", array($orden['idordentrabajo'])
            )->fetchArray();
            foreach ($materiales as $material) {
                if ($material['idactividad']) {
                    $materialesEnActividad[] = $material;
                } else {
                    $materialesSinActividad[] = $material;
                }
            }
            $data[$index]['materialesenactividad'] = $materialesEnActividad;
            $data[$index]['materialessinactividad'] = $materialesSinActividad;
            $data[$index]['todosmateriales'] = $materiales;
            $actividadesDelServicio = [];
            $actividadesNoDelServicio = [];
            $selectActividades = 'a.idordenactividad, a.idactividad, a.denominacion, a.fechainicio, a.fechafin,
                a.tiempoplanificado,a.idresponsable, a.observacion, a.idarea, a.prioridad, a.tiemporeal,
                a.tarifahora, a.idpadre ';
            $actividades = Doctrine_Query::create()->from("DatActividadOrden a")->select($selectActividades)->where(
                " a.idordentrabajo = ?", array($orden['idordentrabajo'])
            )->fetchArray();
            foreach ($actividades as $actividad) {
                if ($actividad['idpadre'] == $orden['idservicio']) {
                    $actividadesDelServicio[] = $actividad;
                } else {
                    $actividadesNoDelServicio[] = $actividad;
                }
            }
            $data[$index]['actividaddelservicio'] = $actividadesDelServicio;
            $data[$index]['actividadnodelservicio'] = $actividadesNoDelServicio;
            $data[$index]['todasactividades'] = $actividades;
        }
        return $data;
    }

    /**
     * @method devuelve las Ordenes de Trabajo especificadas en estado Cerrado.
     * @param array $idsDoc
     *
     * @return array
     */
    public function cargarOrdenesTrabajoCerradasEspecificadas($idsDoc = array())
    {
        $conn = Zend_Registry::get('conexion');
        $iddocimplode = implode(',', $idsDoc);
        $selectMateriales = "select DISTINCT mt.idindicador as idindicador, mt.idproducto as idproducto, SUM(mt.cantidadreal) as cantidad,
            mt.importecup as importecontable, mt.importecuc as alternativo, otm.idtipopreciomat as idtipoprecio, SUM(coalesce(mt.enproceso,0)) as enproceso,
            SUM(coalesce(mt.facturado,0)) as facturado,(select oa.idcentrodecosto from mod_logtaller.dat_ordenactividad oa where oa.idordentrabajo = mt.idordentrabajo
            and oa.idactividad = mt.idactividad limit 1) as idcentrocosto, coalesce(mt.modificado,0) as modificado, mt.idactividad as idactividadmaterial
            from mod_logtaller.dat_material mt
            inner join mod_logtaller.dat_ordentrabajo otm on otm.idordentrabajo = mt.idordentrabajo
            where mt.idordentrabajo in (" . $iddocimplode . ") and mt.porplan = 0
            and (coalesce(mt.enproceso,0) + coalesce(mt.facturado,0)) < mt.cantidadreal
            group by mt.idindicador, mt.importecup, mt.importecuc, otm.idtipopreciomat, mt.idproducto,mt.idordentrabajo,mt.idactividad, mt.modificado,mt.idactividad
			having SUM(mt.cantidadreal) > 0";
        $materialesSinActividad = $conn->execute($selectMateriales)->fetchAll(PDO::FETCH_ASSOC);
        /*Doctrine_Query::create()->select($selectMateriales)->from("DatMaterial mt")
        ->innerJoin("mt.DatOrdenTrabajo otm")
        ->whereIn("mt.idordentrabajo", $idsDoc)->addWhere('mt.porplan = 0')
        ->groupBy('mt.idindicador, mt.importecup, mt.importecuc, otm.idtipopreciomat')->fetchArray();*/
        $selectActividades = "select DISTINCT a.idactividad as idactividad, COUNT(a.idactividad) as cantidad,
            a.denominacion as denominacion, SUM(a.tiemporeal) as tiemporeal, SUM(a.tarifahora) as tarifahora,
            SUM(a.costo) as costo, SUM(a.importealternativo) as importealternativo,a.precio,a.precioalternativo,
            cfgAct.idindicador as idindicador, cfgAct.denominacion as denominacion, ot.idtipoprecio as idtipoprecio, a.idcentrodecosto as idcentrocosto,
             SUM(coalesce(a.enproceso,0)) as enproceso, SUM(coalesce(a.facturado,0)) as facturado, coalesce(a.modificado,0) as modificado,
             a.idunidadmedida as idunidadmedida, a.minutosactividad as minutosactividad
            from mod_logtaller.dat_ordenactividad a inner join mod_logtaller.dat_ordentrabajo ot ON ot.idordentrabajo = a.idordentrabajo
            INNER JOIN mod_logtaller.conf_actividad cfgAct ON cfgAct.idactividad = a.idactividad
            where a.idordentrabajo in (" . $iddocimplode . ") and (coalesce(a.enproceso,0) + coalesce(a.facturado,0)) < a.tiemporeal
            group by a.idactividad, a.denominacion, a.costo,a.precio,a.precioalternativo, cfgAct.idindicador, cfgAct.denominacion, ot.idtipoprecio, a.idcentrodecosto, a.modificado, a.idunidadmedida, a.minutosactividad ";
        $actividades = $conn->execute($selectActividades)->fetchAll(PDO::FETCH_ASSOC);
        /*$actividades = Doctrine_Query::create()->select($selectActividades)->from("DatActividadOrden a")
        ->innerJoin("a.DatOrdenTrabajo ot")
        ->innerJoin("a.ConfActividad cfgAct")
        ->whereIn( "a.idordentrabajo ", $idsDoc )
        ->groupBy('a.idactividad, a.denominacion, a.costo, cfgAct.idindicador, cfgAct.denominacion, ot.idtipoprecio ')
        ->fetchArray();*/
        foreach ($actividades as $index => &$actividad) {
            $materialesEnActividad = "select DISTINCT mt.idindicador as idindicador, SUM(mt.cantidad) as cantidad,
                mt.importecup as importecontable, mt.importecuc as alternativo, otm.idtipopreciomat as idtipoprecio
                from mod_logtaller.dat_material mt
                inner join mod_logtaller.dat_ordentrabajo otm on otm.idordentrabajo = mt.idordentrabajo
                where mt.idordentrabajo in (" . $iddocimplode . ") and mt.porplan = 1
                group by mt.idindicador, mt.importecup, mt.importecuc, otm.idtipopreciomat";
            /*$materialesEnActividad =
            Doctrine_Query::create()->select($selectMateriales)->from("DatMaterial mt")->addWhere('mt.porplan = 1')
            ->innerJoin("mt.DatOrdenTrabajo otm")
            ->whereIn("mt.idordentrabajo", $idsDoc)
            ->addWhere('mt.idactividad = ?', array($actividad['idactividad']))
            ->groupBy('mt.idindicador, mt.importecup, mt.importecuc, otm.idtipopreciomat ')
            ->fetchArray();*/
            $actividad['materiales'] = $materialesEnActividad;
            unset($actividades[$index]['idactividad']);
        }
        $data = array('productos' => $materialesSinActividad, 'actividades' => $actividades);
        return $data;
    }

    /**
     * @method devuelve un array o el DQL con las Ordenes de Trabajo en estado Pendiente.
     * @param      $parametros
     * @param bool $dqlResult
     *
     * @return array|Doctrine_Query
     */
    public function cargarOrdenesTrabajo($parametros, $dqlResult = false)
    {
        $dql = $this->devolverOrdenesTrabajo($parametros, true);
        if ($dqlResult) {
            return $dql;
        }
        $result = $dql->fetchArray();
        if ($parametros['recsolicitudservicio']) {
            $result = $this->mostrarEntidadEnLasOrdenes($result, $parametros);
        }
        return array("datos" => $result, "cantidad" => $dql->count());
    }

    public function devolverIncripcionesDisponibles($parametros, $servIncripcion)
    {
        $param['estado'] = array(1, 2);
        $dqlAux = $this->devolverOrdenesTrabajo($param, true);
        $dqlAux->andWhere('ord.documentoorigen = 2');
        foreach ($dqlAux->fetchArray() as $index => $ids) {
            $parametros['excluir'][$index] = $ids['iddocumentoorigen'];
        }
        $parametros['excluir'] = (count($parametros['excluir']) > 0) ? $parametros['excluir'] : array();
        $parametros['estado'] = 3;
        $result = $servIncripcion->devolverInscripciones($parametros, false);
        return $result['datos'];
    }

    /**
     * @param $parametros
     *
     * @return array
     */
    public function devolverEnviadosAReparar($parametros)
    {
        if ($this->_utilesServices) {
            if (!$parametros['busquedaavanzada']) {
                $parametros['excluir'] = $this->getIdRegNumEnOrdenAbierta(array())['excluirregnum'];
                if (count($parametros['excluir']) == 0) {
                    unset($parametros['excluir']);
                }
                if ($parametros['ventana'] == "tallaft") {
                    $start = $parametros['start'];
                    $limit = $parametros['limit'];
                    $parametros['denomidmedio'] = ($parametros['criterio']) ? $parametros['criterio'] : null;
                    unset($parametros['criterio']);
                    if ($parametros['idclienteestructura']) {
                        $parametros['identidad'] = $parametros['idclienteestructura'];
                    } else {
                        $parametros['identidad'] = -1;
                    }
                    //$parametros['identidad'] = $this->global->Estructura->idestructura;
                    $dqlRNA = $this->_utilesServices->getMediosDisponibles($parametros, true);
                    if ($parametros['denomidmedio']) {
                        $whereIdentificador = $this->_utilesServices->getIdentificadorDat($parametros);
                        $dqlRNA->addWhere($whereIdentificador);
                    }
                    $dqlRNA->andWhere(" drna.idestadoperacion IN (1,2,3,4)");
                    $dqlRNA->andWhere(" drna.esbaja = 0");
                    $dqlRNA->offset($start);
                    $dqlRNA->limit($limit);
                    return array('datos' => $dqlRNA->fetchArray(), 'cantidad' => $dqlRNA->count());
                }
                return $this->_utilesServices->getEnviadosAReparar($parametros);
            } else {
                return $this->getRegNumericoBA($parametros);
            }
        }
        return array();
    }

    /**
     * @param $parametros
     *
     * @return array
     */
    public function devolverEnviadosAMantenimiento($parametros)
    {
        $fechaDiaPeriodo = DatosMaestrosHelper::__init();
        $fechasubTalleres = $fechaDiaPeriodo->getFechaContableSubsistemaObj(
            $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_TALLERES
        );
        $fechasist = $fechasubTalleres->fechasist;
        $query = Doctrine_Query::create();
        $query
            ->from('DatRegNumerico drn')
            ->innerJoin('drn.DatRegnumericoActivo drna')
            ->innerJoin('drn.DatProductoLogistica dp')
            ->innerJoin('dp.CfgPlanificacionMantenimiento cpm')
            ->innerJoin('cpm.DatMedio dm')
            ->innerJoin('cpm.NomIndicador ind')
            ->innerJoin('ind.NomIndicadorhoja indh')
            ->orderBy('drn.nroserie,drna.nroinventario')
            ->where("dm.idindicador is NULL OR cpm.recursoconsumido = drna.cantidadrecursoconsumido  OR  (drna.fechaexpini + cast(cpm.periodo || 'month' as interval )) >= ?", $fechasist);

        $mProducto = new MaestroProductoModel();
        $mProducto->addQueryJoinMarcaModelo($query, 'indh', 'nmar', 'nm', true, true, 'ind');
        $query->addWhere('drna.esbaja = 0');
        $query->select(
            'cpm.idplanificacionmantenimiento, cpm.periodo, cpm.recursoconsumido, cpm.idindicador, dp.idproducto ,
            ind.denominacion as denominacion, nmar.denominacion as marca, nm.denominacion as modelo, drn.nroserie as nroserie, drn.idregnumerico ,
            drna.nroinventario as nroinventario,drna.cantidadrecursoconsumido,drna.fechaexpini,dm.idindicador, dm.dinamicos as dinamicos, ind.idnaturaleza,
            ');

        return array('cantidad' => $query->count(), 'datos' => $query->fetchArray());
    }

    public function getQueryBasicoOrdenTrabajo($params)
    {
        $params['clienteorden'] = 1;
        $dql = parent::devolverDocumentos($params);
        $dql->addSelect(
            "(SELECT cc.idcliente FROM DatDocumentoCliente cc "
            . "WHERE cc.iddocumento = d.iddocumento and cc.tipocliente = 2 LIMIT 1) as idcentrocosto"
        );
        $dql->innerJoin('d.DatOrdenTrabajo ord')->addSelect(' ord.idordentrabajo as idordentrabajo');
        return $dql;
    }

    public function getRegNumericoBA($parametros)
    {
        if ($this->_utilesServices) {
            $parametros['estado'] = array(1, 2);
            $parametros = $this->getIdRegNumEnOrdenAbierta($parametros);
            $parametros['arrayidregNum'] = $parametros['excluirregnum'];
            unset($parametros['excluirregnum']);
            $dql = $this->_utilesServices->getQueryDataVisualizarRegNumActivos($parametros);
            $dql->addSelect("nmarc.denominacion as marca");
            $dql->addSelect("nmod.denominacion as modelo");
            return array('datos' => $dql->fetchArray(), 'cantidad' => $dql->count());
        }
        return array();
    }

    public function getIdRegNumEnOrdenAbierta($parametros)
    {
        $parametros['estado'] = ($parametros['estado']) ? $parametros['estado'] : array(1, 2);
        $dql = $this->getQueryBasicoOrdenTrabajo($parametros);
        $result =
            $dql->select('d.iddocumento, med.idproducto as idregnumerico')->innerJoin('ord.DatMedio med')->andWhere(
                "med.idproducto is not null"
            )->fetchArray();
        $idsRegNum = array();
        foreach ($result as $dat) {
            $idsRegNum[] = $dat['idregnumerico'];
        }
        unset($parametros['estado']);
        $parametros['excluirregnum'] = $idsRegNum;
        return $parametros;
    }

    public function devolverEnviadosATallerConEstado($parametros = array())
    {
        if ($this->_utilesServices) {
            $parametros['idestructura'] = $this->idestructuracomun;
            if ($parametros['datos']) {
                $datos = $parametros['datos'];
            } else {
                $aux = $this->_utilesServices->getEnviadosAReparar($parametros);
                if (isset($aux['datos'])) {
                    $datos = $aux['datos'];
                } else {
                    $datos = $aux;
                }
            }
            /*$datos = ($parametros['datos']) ? $parametros['datos'] :
            $this->_utilesServices->getEnviadosAReparar($parametros);*/
            foreach ($datos as $pos => $reg) {
                $parametros['estado'] = array(1, 2, 9);
                $dql = $this->getQueryBasicoOrdenTrabajo($parametros);
                $result =
                    $dql->select('med.idproducto as idregnumerico, d.estado as estado')->innerJoin('ord.DatMedio med')
                        ->andWhere('ord.iddocumentoorigen = ?', array($reg['iddocumento']))->andWhereIn(
                            'ord.documentoorigen ', array(5, 6)
                        )->andWhere('med.idproducto = ?', array($reg['idregnumerico']))->fetchArray();
                if ($result) {
                    if ($result[0]['estado'] == EstadoDocumentoModel::ESTADO_CERRADO) {
                        $datos[$pos]['estadoregistronumerico'] = 'terminado';
                        $datos[$pos]['noRecepcion'] = 'Reparado';
                    } else {
                        if ($result[0]['estado'] == EstadoDocumentoModel::ESTADO_PENDIENTE ||
                            $result[0]['estado'] == EstadoDocumentoModel::ESTADO_ELABORACION
                        ) {
                            $datos[$pos]['estadoregistronumerico'] = 'enproceso';
                            $datos[$pos]['noRecepcion'] = 'En proceso';
                        }
                    }
                } else {
                    $datos[$pos]['estadoregistronumerico'] = 'enespera';
                    $datos[$pos]['noRecepcion'] = 'No procesado';
                }
            }
            return $datos;
        }
        return array('datos' => array(), 'cantidad' => 0);
    }

    public function devolverServiciosDeLasOrdenesCerradas($alias = 'ts', $params = array())
    {
        $parametros['idestructura'] = $this->idestructuracomun;
        $parametros['estado'] = EstadoDocumentoModel::ESTADO_CERRADO;
        $parametros['clienteorden'] = 1;
        $dql = parent::devolverDocumentos($parametros);
        $dql->innerJoin('d.DatOrdenTrabajo ord')->addSelect(' ord.idordentrabajo as ids');
        if ($params['fechainicio']) {
            $dql->addWhere("ord.fechainicio >= ? ", array($params['fechainicio']));
        }
        if ($params['fechafin']) {
            $dql->addWhere("ord.fechafin <= ? ", array($params['fechafin']));
        }
        $fetch = $dql->fetchArray();
        foreach ($fetch as $doc) {
            $array[] = $doc['ids'];
        }
        $dqlServ = new Doctrine_Query();
        if (count($array) < 1) {
            $array[] = 0;
        }
        $dqlServ->from("DatTrabajoServicio {$alias}")->whereIn("{$alias}.idordentrabajo ", $array);
        return $dqlServ;
    }

    public function devolverIndicadoresRecuperables($parametros)
    {
        if ($this->_aperturaAFT && $parametros['idproducto']) {
            return $this->_ppaService->devolverPiezas($parametros);
        }
        $parametros['idpadre'] = ($parametros['idindicador']) ? json_decode($parametros['idindicador']) : array(1);
        unset($parametros['idindicador']);
        $mproducto = new MaestroProductoModel();
        $dql = $mproducto->cargarGridNomenclador($parametros, true, false);
        if ($parametros['idpadre']) {
            $dql->andWhereIN('ind.idpadre', $parametros['idpadre']);
        }
        return array('cantidad' => $dql->count(), 'datos' => $dql->fetchArray());
    }

    public function adicionarPiezasRetiradas($parametros)
    {
        if ($parametros['piezas']) {
            $piezasAddArray = new Doctrine_Collection('DatPiezaRecuperable');
            foreach ($parametros['piezas'] as $pieza) {
                $params = array();
                $pieza['datos'] = ($pieza['datos']) ? json_encode($pieza['datos']) : null;
                $pieza['idordentrabajo'] = $parametros['idordentrabajo'];
                $pieza['marca'] = ($pieza['marca'] == "") ? null : $pieza['marca'];
                $pieza['modelo'] = ($pieza['modelo'] == "") ? null : $pieza['modelo'];
                $pieza['destino'] = ($pieza['destino'] == "") ? null : $pieza['destino'];
                $pieza['iddestino'] = ($pieza['iddestino'] == "") ? null : $pieza['iddestino'];
                $pieza['motivo'] = ($pieza['motivo'] == "") ? null : $pieza['motivo'];
                $cierre = str_replace('/', '-', $pieza['fechacierre']);
                $fechaCierre = (new DateTime($cierre))->format('Y-m-d');
                $adquisicion = str_replace('/', '-', $pieza['fechaadquisicion']);
                $fechaAdquisicion = (new DateTime($adquisicion))->format('Y-m-d');
                $dias = (strtotime($fechaCierre) - strtotime($fechaAdquisicion)) / 86400;
                $dias = ($dias < 0) ? 0 : $dias;
                $dias = floor($dias);
                $pieza['vidautil'] = $dias;
                $objPieza = new DatPiezaRecuperable();
                if ($pieza['idpiezarecuperable']) {
                    $objPieza->assignIdentifier($pieza['idpiezarecuperable']);
                }
                if (is_array($pieza)) {
                    $objPieza->synchronizeWithArray($pieza);
                }
                $piezasAddArray[] = $objPieza;
                if ($this->_aperturaAFT && $pieza['idpiezaagregado']) {
                    $params['fechacierre'] = Date('d/m/Y');
                    $params['idpiezaagregado'] = $pieza['idpiezaagregado'];
                    //$params['idregnumerico'] = $pieza['idregnumerico'];
                    //$params['idindicador'] = $pieza['idindicador'];
                    $this->_ppaService->actualizarFechaCierre($params);
                }
            }
            if ($piezasAddArray->count()) {
                $piezasAddArray->save();
            }
        }
    }

    /**
     * @param $parametros
     *
     * @return array|Doctrine_Query
     */
    public function cargarPiezasRetiradas($parametros)
    {
        $parametros['idestructura'] = $this->idestructuracomun;
        $mproducto = new MaestroProductoModel();
        $query = new Doctrine_Query();
        $query->from("DatPiezaRecuperable pz")->innerJoin('pz.NomIndicador ind')->leftJoin('pz.DatOrdenTrabajo ot')
            ->leftJoin('ot.DatDocumento d')->leftJoin('pz.NomDestino des')->leftJoin('ot.DatMedio med')
            ->leftJoin('med.NomIndicador indmed');
        $mproducto->addQueryJoinIndicadorHoja($query, 'ind', 'indh', 1);
        $mproducto->addQueryJoinIndicadorHoja($query, 'indmed', 'indhmed', 1);
        $mproducto->configuracionHelper->getQueryJoinUnidadMedida(
            $query, 'ind', 'umedida', 'umedida.abreviaturaunidadmedida as umedida', 'leftJoin'
        );
        $mproducto->addQueryJoinMarcaModelo($query, 'indh', 'nmar', 'nm', true, true);
        $mproducto->addQueryJoinMarcaModelo($query, 'indhmed', 'nmarmed', 'nmmed', true, true, "indmed");
        $query->select(
            ' pz.idpiezarecuperable, pz.datos, pz.idpadre, d.nrodoc as nrodoc, ind.idindicador as idindicador,
            pz.iddestino, des.denominacion as destino, pz.motivo, pz.vidautil, pz.idpiezaagregado'
        )->addSelect("ind.denominacion as denominacion, ind.codigo as codigo")->addSelect(
            "med.idindicador as indicadormedio, ot.atributoidentificador as atributoidentificador,
                (indmed.denominacion || ' '||((Case When indhmed.idmarca is not null " .
            "Then (nmarmed.denominacion  || (Case When indhmed.idmodelo is not null Then ' - ' Else '' End)) " .
            "Else '' End)  || (Case When indhmed.idmodelo is not null " .
            "Then nmmed.denominacion Else '' End))) as descripcionmarcamodelomedio"
        )->addSelect(
            " (ind.denominacion || ' '||((Case When indh.idmarca is not null " .
            "Then (nmar.denominacion  || (Case When indh.idmodelo is not null Then ' - ' Else '' End)) " .
            "Else '' End)  || (Case When indh.idmodelo is not null " . "Then nm.denominacion Else '' End)))
            as descripcionmarcamodelo, nm.denominacion as modelo, nmar.denominacion as marca"
        );
        $this->filtrosCargarPiezasRetiradas($parametros, $query);
        $query->orderBy("pz.idpiezarecuperable DESC");
        if ($parametros['dql']) {
            return $query;
        } else {
            return array('cantidad' => $query->count(), 'datos' => $query->fetchArray());
        }
    }

    private function filtrosCargarPiezasRetiradas($parametros, $query)
    {
        if ($parametros['idpiezarecuperable']) {
            $query->andWhere('pz.idpiezarecuperable = ?', array($parametros['idpiezarecuperable']));
        }
        if ($parametros['idindicador']) {
            $query->andWhere('pz.idindicador = ?', array($parametros['idindicador']));
        }
        if ($parametros['idindicadormedio']) {
            $query->andWhere('med.idindicador = ?', array($parametros['idindicadormedio']));
        }
        if ($parametros['iddestino']) {
            $query->andWhere(' pz.iddestino = ?', array($parametros['iddestino']));
        }
        if ($parametros['idpadre']) {
            $query->andWhere('pz.idpadre = ?', array($parametros['idpadre']));
        }
        if ($parametros['idordentrabajo']) {
            $query->andWhere('pz.idordentrabajo = ?', array($parametros['idordentrabajo']));
        }
        if ($parametros['fechainicio']) {
            $query->addWhere("ot.fechainicio >= ? ", array($parametros['fechainicio']));
        };
        if ($parametros['fechafin']) {
            $query->addWhere("ot.fechafin <= ? ", array($parametros['fechafin']));
        };
        if ($parametros['idestructura']) {
            $query->addWhere("d.idestructuracomun = ? ", array($parametros['idestructura']));
        };
        if ($parametros['vidautil']) {
            $query->addWhere("pz.vidautil = ? ", array($parametros['vidautil']));
        };
        $this->logisticaDoctrine->addQueryLimits($query, $parametros);
    }

    /**
     * @param $parametros
     *
     * @descripcion Devuelve los indicadores de las piezas registradas sin repetir el tipo
     * @return array
     */
    public function cargarIndicadoresPiezasRetiradas($parametros)
    {
        $parametros['idestructura'] = $this->idestructuracomun;
        $query = new Doctrine_Query();
        $query->from('NomIndicador ind')->innerJoin('ind.DatPiezaRecuperable pz')->leftJoin('pz.DatOrdenTrabajo ot')
            ->leftJoin('ot.DatDocumento d')->select(
                "ind.idindicador, pz.idpadre as idpadre, (SELECT x.denominacion FROM NomIndicador x
                where x.idindicador = pz.idpadre) as denominacion "
            )->where("d.idestructuracomun = ? ", array($parametros['idestructura']))->distinct('ind.idpadre');
        return array('cantidad' => $query->count(), 'datos' => $query->fetchArray());
    }

    /**
     * @param $parametros
     *
     * @return mixed
     */
    public function eliminarPiezasRetiradas($parametros)
    {
        if ($this->_aperturaAFT && $parametros['idregnumerico'] && $parametros['idpiezaagregado']) {
            $piezas = Zend_Json::decode($parametros['idpiezaagregado']);
            foreach ($piezas as $pieza) {
                $params['fechacierre'] = null;
                //$params['idregnumerico'] = $parametros['idregnumerico'];
                $params['idpiezaagregado'] = $pieza;
                $this->_ppaService->actualizarFechaCierre($params);
            }
        }
        $parametros['idpiezarecuperable'] = Zend_Json::decode($parametros['idpiezarecuperable']);
        return Doctrine_Query::create()->delete('DatPiezaRecuperable')->where(
            'idordentrabajo =? ', $parametros['idordentrabajo']
        )->andWhereIn('idpiezarecuperable ', $parametros['idpiezarecuperable'])->execute();
    }

    /**
     * @param $parametros
     *
     * @return array
     */
    public function cargarCantidaPiezasRetiradasPorIndicador($parametros)
    {
        $mproducto = new MaestroProductoModel();
        $parametros['idestructura'] =
            ($parametros['idestructura']) ? $parametros['idestructura'] : array($this->idestructuracomun);
        $query = new Doctrine_Query();
        $query->from('NomIndicador ind')->innerJoin('ind.DatPiezaRecuperable pz ')->innerJoin('pz.DatOrdenTrabajo ot')
            ->innerJoin('ot.DatDocumento d')->innerJoin('ot.DatMedio med');
        $mproducto->addQueryJoinIndicadorHoja($query, 'ind', 'indh', 1);
        $mproducto->addQueryJoinMarcaModelo($query, 'indh', 'nmar', 'nm', true, true);
        $query->select(
            "ind.idindicador, ind.denominacion, pz.idpadre as idpadre, nm.denominacion as modelo,
             nmar.denominacion as marca,
            count(ind.idindicador) as cantidad, (ind.denominacion || ' '||
            ((Case When indh.idmarca is not null
            Then (nmar.denominacion  || (Case When indh.idmodelo is not null Then ' - ' Else '' End))
            Else '' End)  || (Case When indh.idmodelo is not null
            Then nm.denominacion Else '' End))) as descripcionmarcamodelo"
        );
        $query->groupBy(
            "ind.idindicador, pz.idpadre, ind.denominacion, indh.idmodelo, indh.idmarca, nmar.denominacion,
             nm.denominacion"
        );
        $this->filtrosCargarCantidaPiezasRetiradasPorIndicador($parametros, $query);
        return array('cantidad' => $query->count(), 'datos' => $query->fetchArray());
    }

    private function filtrosCargarCantidaPiezasRetiradasPorIndicador($parametros, $query)
    {
        if ($parametros['idindicador']) {
            $query->andWhere('pz.idindicador = ?', array($parametros['idindicador']));
        }
        if ($parametros['idindicadormedio']) {
            $query->andWhere('med.idindicador = ?', array($parametros['idindicadormedio']));
        }
        if ($parametros['idestructura']) {
            if (!is_array($parametros['idestructura'])) {
                $parametros['idestructura'] = array($parametros['idestructura']);
            }
            $query->andWhereIn('d.idestructuracomun ', $parametros['idestructura']);
        }
        if ($parametros['fechainicio']) {
            $query->addWhere("ot.fechainicio >= ? ", array($parametros['fechainicio']));
        };
        if ($parametros['fechafin']) {
            $query->addWhere("ot.fechafin <= ? ", array($parametros['fechafin']));
        };
    }

    /**
     * @param $params
     * @param $dqlResult
     *
     * @return array
     */
    public function cargarPiezasFaltantesEnLasOrdenes($params, $dqlResult)
    {
        $query = Doctrine_Query::create();
        $select = "ind.idindicador, ind.denominacion, ind.codigo";
        $query->select($select)->from('NomIndicador ind')->leftJoin('ind.DatMaterial m')->innerJoin(
            'm.DatOrdenTrabajo ord'
        )->innerJoin('ord.DatDocumento d')->where('d.estado = ?', array(EstadoDocumentoModel::ESTADO_PENDIENTE))->where(
            'm.estado = 1'
        )->orderBy("ind.idindicador DESC");
        if ($params['criterio']) {
            $query->addWhere("ind.denominacion iLike '%{$params['criterio']}%' ");
        }
        $mproducto = new MaestroProductoModel();
        $mproducto->addQueryJoinIndicadorHoja($query, 'ind', 'indh', 1);
        if ($params['aprobado']) {
            $query->andWhere('m.aprobado = ? ', array($params['aprobado']));
        }
        if ($dqlResult) {
            return $query;
        } else {
            if ($params['limit']) {
                $this->logisticaDoctrine->addQueryLimits($query, $params);
            }
            return array('cantidad' => $query->count(), 'datos' => $query->fetchArray());
        }
    }

    public function cargarDestinos($params)
    {
        $nomenclTallServis = new NomencladoresTallService();
        $obj = array(
            'modelo' => 'NomDestino', 'idnom' => 'iddestino', 'start' => $params['start'], 'limit' => $params['limit'],
        );
        return $nomenclTallServis->cargarNomenclador($obj, false);
    }

    public function generarPedido($params)
    {
        $pedidoServices = new PedidoService();
        $datosPedido = $pedidoServices->adicionarPedido($params['idcliente'], Zend_Json::decode($params['productos']), null, $params['idordentrabajo']);
        $pedidoOrden = new DatPedidoOrdenTrabajo();
        $pedidoOrden->idpedido = $datosPedido['iddocumento'];
        $pedidoOrden->idordentrabajo = $params['idordentrabajo'];
        $pedidoOrden->save();
        return $datosPedido;
    }

    public function cargarPedidos($params)
    {
        $pedidoServices = new PedidoService();
        $params['talleres'] = true;
        return $pedidoServices->cargarDocPedido($params);
    }

    public function cargarServiciosPedido($params)
    {
        $pedidoServices = new PedidoService();
        $params['talleres'] = true;
        return $pedidoServices->cargarServiciosXPedido($params['idpedido']);
    }

    /**
     * @param $params arra('idregnumerico','idplanificacionmantenimiento')
     *
     * @return int
     */
    public function existePlanfMantenimiento($params)
    {
        $query = Doctrine_Query::create();
        $select = "ord.idordentrabajo";
        $query->select($select)->from('DatOrdenTrabajo ord')->innerJoin('ord.DatMedio med')->innerJoin(
            'ord.DatDocumento d'
        )->where('d.estado = ?', array(EstadoDocumentoModel::ESTADO_CERRADO))->andWhere(
            "med.idproducto = ?", array($params['idregnumerico'])
        )->andWhere("ord.idplanificacionmantenimiento = ?", array($params['idplanificacionmantenimiento']));
        return count($query->fetchArray());
    }

    public function cargarSolicitudesAprobadas($params)
    {
        $params['excluir'] = $this->idDocumentoOrigenConOrdenAbierta(1);
        return $this->_solicitudServices->getSolicitudesAprobadas($params);
    }

    public function cargarSolicitudesATercerosAprobadas($params)
    {
        $params['excluir'] = $this->idDocumentoOrigenConOrdenAbierta(3);
        return $this->_solicitudServices->getSolicitudTerceros($params);
    }

    private function idDocumentoOrigenConOrdenAbierta($docOrigen)
    {
        $params = array();
        $params['idestructura'] = $this->idestructuracomun;
        $params['estado'] = array(EstadoDocumentoModel::ESTADO_PENDIENTE, EstadoDocumentoModel::ESTADO_ELABORACION);
        $params['clienteorden'] = 1;
        $dql = parent::devolverDocumentos($params);
        $result = $dql->innerJoin('d.DatOrdenTrabajo ot')->andWhere("ot.documentoorigen = {$docOrigen}")->addSelect(
            'ot.iddocumentoorigen as iddocumentoorigen'
        )->fetchArray();
        $docs = array();
        foreach ($result as $doc) {
            $docs[] = $doc['iddocumentoorigen'];
        }
        return $docs;
    }

    /**
     * Para documento de salida ...
     */
    public function cargarOrdenesPendientesConMaterialesListos($parametros)
    {
        $relations[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatMovimientos',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'iddocumento'),
        );
        $this->doctrineHelper->tryInyectRelactions(new DatDocumentoPadre, $relations);
        $parametros['estado'] = array(2);
        $parametros['clienteorden'] = 1;
        $dql = parent::devolverDocumentos($parametros);
        $idsDoc = $dql->select("d.iddocumento")->innerJoin('d.DatOrdenTrabajo ord')->fetchArray();
        $relations[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatDocumentoPadre',
            'properties' => array('local' => 'idordentrabajo', 'foreign' => 'idpadre'),
        );
        $this->doctrineHelper->tryInyectRelactions(new DatMaterial, $relations);
        $idsExcluir = array();
        foreach ($idsDoc as $doc) {
            $idOrdenTrabajo = $doc['iddocumento'];
            $conn = Zend_Registry::get('conexion');
            /*$sql = "select m.idindicador AS idindicador,(select sum(mv.cantidad)
            from mod_logistica.dat_documentopadre dp
            inner join mod_logistica.dat_movimiento mv on dp.iddocumento = mv.iddocumento
            inner join mod_logistica.dat_documento dd on dp.iddocumento = dd.iddocumento
            inner join mod_logistica.dat_producto p on mv.idproducto = p.idproducto
            where dp.idpadre = m.idordentrabajo and p.idindicador = m.idindicador and p.idproducto = m.idproducto and dd.estado <> 7
            ) as cantmov, m.cantidad
            FROM mod_logtaller.dat_material m
            WHERE (m.aprobado = true AND m.idordentrabajo = $idOrdenTrabajo)
            GROUP BY m.idindicador, m.cantidad, m.idordentrabajo,m.idproducto
            order by m.idindicador";*/
            $sql = "select m.idindicador AS idindicador,m.cantidadreal as cantmov, m.cantidad
			FROM mod_logtaller.dat_material m
			WHERE (m.aprobado = true AND m.idordentrabajo = $idOrdenTrabajo)
			GROUP BY m.idindicador, m.cantidad, m.idordentrabajo,m.idproducto,m.cantidadreal
			order by m.idindicador";
            $materiales = $conn->fetchAll($sql);
            $pendientes = array();
            foreach ($materiales as $mat) {
                if ($mat['cantidad'] > $mat['cantmov']) {
                    $pendientes[] = $mat;
                }
            }
            if (!count($pendientes) > 0) {
                $idsExcluir[] = $idOrdenTrabajo;
            }
        }
        //print_r($idsExcluir);die;
        return $idsExcluir;
    }

    /**
     * Devuelve la agencia para cuando lo origina una solicitud a terceros
     * que puede ser una estructura o un proveedor
     */
    public function cargarAgencia($parametros)
    {
        $start = ($parametros['start']) ? $parametros['start'] : 0;
        $limit = ($parametros['limit']) ? $parametros['limit'] : 30;
        if ($parametros['tipo'] == 1) {
            $arrayCompleto = $this->estructuraHelper->getEntidadesByDominio(
                $this->global->perfil->iddominio
            );
            $proveedores['cantidad'] = count($arrayCompleto);
            $proveedores['datos'] = array_slice(
                $arrayCompleto, $start, $limit
            );
        } else {
            if ($parametros['criterio']) {
                $filtro['nombre'] = $parametros['criterio'];
            }
            $proveedores = $this->configuracionHelper->getClientesProveedorByParams(
                null, $this->global->Estructura->idestructura, true, true, true, $filtro, $start, $limit
            );
        }
        return $proveedores;
    }

    public function cargarTecnicosDeActividadesEnOrdenes($parametros)
    {
        $query = new Doctrine_Query();
        $query->from("DatActividadOrden act")->innerJoin('act.DatOrdenTrabajo ot')->leftJoin('ot.DatDocumento d')
            ->where('d.idestructuracomun =?', array($this->global->Estructura->idestructura))/*->andWhere('d.estado = 9')*/
            ->andWhere('act.idresponsable is not null')->select('act.idresponsable');

        return $query->fetchArray();
    }

    public function cargarTiposDePrecio($params)
    {
        if ($this->_aperturaFAC) {
            //Esto se hizo para que en la Orden de Trabajo cargaran todos los tipos de precio sin tener en cuenta  la entidad
            $params['cargarSinEntidad'] = 1;

            $facService = new FacturacionService();
            $params['idsubsistema'] = LogisticaGlobal::SUBSISTEMA_TALLERES;
            return $facService->getTipoPreciosCliente($params);
        }
    }

    public function actulizarNrosVale($params, $cancelar = false)
    {
        $colMat = new Doctrine_Collection("DatMaterial");
        foreach ($params as $idOrden => $materiasles) {
            foreach ($materiasles as $mat) {
                $material = new DatMaterial();
                $objMat = Doctrine::getTable('DatMaterial')
                    ->findByDql("idindicador = {$mat['idindicador']} and idordentrabajo = {$idOrden} and idproducto = {$mat['idproducto']}");
                $objMatArr = $objMat->toArray()[0];
                $noVales = (!$objMatArr['nrosvales']) ? "" : $objMatArr['nrosvales'];
                $objMatArr['nrosvales'] .= ($noVales == "") ? $mat['nrodoc'] : ',' . $mat['nrodoc'];
                if (!$cancelar) {
                    $cantidadreal = $objMatArr['cantidadreal'];
                    $salidad = ($objMatArr['cantidad'] - $cantidadreal);
                    if ($mat['cantidad'] > $salidad) {
                        $objMatArr['cantidadreal'] = $objMat->cantidad - $cantidadreal;
                    } else {
                        $objMatArr['cantidadreal'] += $mat['cantidad'];
                    }
                } else {
                    $actual = explode(",", $noVales);
                    $objMatArr['nrosvales'] = "";
                    foreach ($actual as $index => $num) {
                        if ($num != $mat['nrodoc']) {
                            if ($index == 0) {
                                $objMatArr['nrosvales'] .= $num;
                            } else {
                                $objMatArr['nrosvales'] .= "," . $num;
                            }

                        }
                    }
                    $objMatArr['cantidadreal'] -= $objMat->cantidad;
                    $objMatArr['cantidadreal'] = ($objMatArr['cantidadreal'] < 0) ? 0 : $objMatArr['cantidadreal'];
                }

                $material->assignIdentifier($objMatArr['idmaterial']);
                $material->synchronizeWithArray($objMatArr);
                $colMat[] = $material;
            }
        }
        if (count($colMat)) {
            $colMat->save();
        }
    }

    /**
     * Cancela el documento.
     * @param numeric $iddocumento
     * @return boolean
     */
    public function cancelarDocumentoTalleres($iddocumento, $parametros = false)
    {
        $resp = $this->checkPuedeCancelar($iddocumento, $parametros);
        if ($resp === true) {
            //$this->anularDocumentoTalleres($iddocumento, $parametros);
            $respuesta = Doctrine_Manager::connection()->fetchAll(
                "SELECT * FROM mod_logtaller.f_cancelarorden(
                  {$iddocumento},'{$parametros['motivo']}', {$this->global->Perfil->idusuario}, {$parametros['tipo']}
                )"
            );
            return true;
        } else {
            return $resp;
        }

    }

    public function checkPuedeCancelar($iddocumento, $parametros = array())
    {
        $dql = Doctrine_Query::create()
            ->select("COALESCE(sum(mat.cantidadreal), 0) as sumCantReal")
            ->from("DatMaterial mat")
            ->where("mat.idordentrabajo =?", array($iddocumento));
        $datos = $dql->fetchArray();
        if ($datos[0]['sumCantReal'] == 0) {
            $sql = "select dd.numeroref from mod_logistica.dat_documento dd " .
                "inner join mod_logfacturacion.dat_docfactura df on df.idfactura = dd.iddocumento " .
                "inner join mod_logistica.dat_documentopadre ddp on ddp.iddocumento = dd.iddocumento " .
                "where ddp.idpadre = {$iddocumento} and dd.estado in (1,2,4)";
            $factura = LogisticaDoctrineHelper::__init()->getConnection()->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
            if (count($factura) == 0) {
                return true;
            } else {
                if ($parametros['tipo'] == 1) {
                    $dqlAct = Doctrine_Query::create()
                        ->select("COALESCE(sum(act.pendiente), 0) as pendiente")
                        ->from("DatActividadOrden act")
                        ->where("act.idordentrabajo =?", array($iddocumento));
                    $datosAct = $dqlAct->fetchArray();
                    if ($datosAct[0]['pendiente'] == 0) {
                        return array('ref' => implode(',', $factura));
                    } else {
                        return true;
                    }
                } else {
                    return array('ref' => implode(',', $factura));
                }
            }
        } else {
            if ($parametros['tipo'] == 2) {
                $dql = Doctrine_Query::create()
                    ->select("(COALESCE(sum(mat.enproceso), 0) + COALESCE(sum(mat.facturado), 0)) as facturas")
                    ->from("DatMaterial mat")
                    ->where("mat.idordentrabajo =?", array($iddocumento));
                $datos = $dql->fetchArray();
                $dqlAct = Doctrine_Query::create()
                    ->select("(COALESCE(sum(act.enproceso), 0) + COALESCE(sum(act.facturado), 0)) as facturas")
                    ->from("DatActividadOrden act")
                    ->where("act.idordentrabajo =?", array($iddocumento));
                $datosAct = $dqlAct->fetchArray();
                if ($datos[0]['facturas'] + $datosAct[0]['facturas'] == 0) {
                    return true;
                } else {
                    return array('nodevtotal' => 1);
                }
            } else {
                $dql = Doctrine_Query::create()
                    ->select("COALESCE(sum(mat.pendiente), 0) as pendiente")
                    ->from("DatMaterial mat")
                    ->where("mat.idordentrabajo =?", array($iddocumento));
                $datos = $dql->fetchArray();
                $dqlAct = Doctrine_Query::create()
                    ->select("COALESCE(sum(act.pendiente), 0) as pendiente")
                    ->from("DatActividadOrden act")
                    ->where("act.idordentrabajo =?", array($iddocumento));
                $datosAct = $dqlAct->fetchArray();
                if ($datos[0]['pendiente'] + $datosAct[0]['pendiente'] > 0) {
                    return true;
                } else {
                    return array('nodevparcial' => 1);
                }
            }
            return array('cantidad' => 1);
        }
        return false;

    }

    public function anularDocumentoTalleres($iddocumento, $parametros = false)
    {
        //if($this->contabilidadHelper->verificarDuoContabilizadoExterno($iddocumento) == false){
        $this->trazaDocumento->guardarTraza('Documento anulado', $iddocumento, EstadoDocumentoModel::ESTADO_ANULADO);
        if ($this->_aperturaAFT) {
            $medio = Doctrine_Query::create()->select('med.idproducto as idregnumerico, med.idindicador as idprod')
                ->from('DatMedio med')->where(
                    'med.idordentrabajo = ?', array($iddocumento)
                )->fetchArray();
            $parametros = $medio[0];
            $parametros['datosEnvRep'][0] = json_decode(json_encode($parametros));
            $parametros['iddocumentoOld'] = $iddocumento;
            $addDocEnvRep = $this->_docAFTServices->addDocDeEnviadoReparar($parametros);
        }
        return $this->estadoModel->setEstadoDocumento($iddocumento, EstadoDocumentoModel::ESTADO_ANULADO);
        //}else{
        //    throw new ZendExt_Exception('LOG_LB_DOC_028');
        //}
    }

    public function cargaInicial()
    {
        $result = parent::cargaInicial();
        $sql = "SELECT DISTINCT ord.cerradopor as id FROM mod_logtaller.dat_ordentrabajo ord
               INNER JOIN mod_logistica.dat_documento d on d.iddocumento = ord.idordentrabajo
               WHERE d.estado = 9 ";
        if ($this->iddoc) {
            $iddoc = is_array($this->iddoc) ? implode($this->iddoc, ',') : $this->iddoc;
            $sql .= " AND d.iddoc IN ({$iddoc})";
        }
        $queryResults = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $usuariosDevueltos = array($this->idusuario);
        foreach ($queryResults as $idusuario) {
            //if (!array_search($idusuario['id'], $usuariosDevueltos)) {
            array_push($usuariosDevueltos, $idusuario['id']);
            //}
        }
        $cerradores = ServiciosSeguridadHelper::__init()->getUsersNameById($usuariosDevueltos);
        $result['usuarios'] = array_merge($result['usuarios'], $cerradores);
        return $result;
    }

    public function cargarMediosCliente($params)
    {
        $query = $this->_maestro->cargarGridNomenclador($params, true);
        $query->innerJoin('ind.DatIndicadorcliente dic')
            ->addSelect('dic.codigoaux as codigoaux')
            ->addWhere('dic.idcliente = ? and dic.estado = 1', $params['idcliente']);

        $cantidad = $query->count();
        $datos = $this->doctrineHelper->addQueryLimits($query, $params)->fetchArray();

        return array('datos' => $datos, 'cantidad' => $cantidad);
    }

    public function validarCerrarOrdenTrabajoProducto($iddocumento)
    {
        if (!is_array($iddocumento)) {
            $iddocumento = array($iddocumento);
        }
        $iddocumento = implode(',', $iddocumento);
        $conn = Zend_Registry::get('conexion');
        $query = "SELECT count(tdm.idmaterial) from mod_logtaller.dat_material tdm
                where tdm.idordentrabajo in ({$iddocumento}) and coalesce(tdm.cantidadreal,0) <= 0 and coalesce(
                (
                select count(dm.idmovimiento) from mod_logistica.dat_movimiento dm where dm.iddocumento in (
                select ddp.iddocumento from mod_logistica.dat_documentopadre ddp
                inner join mod_logistica.dat_documento d on d.iddocumento = ddp.iddocumento
                where ddp.idpadre = tdm.idordentrabajo and d.estado = 4
                ) and dm.idproducto = tdm.idproducto
                ),0) = 0";
        $resultado = $conn->fetchAll($query);
        if ($resultado[0]['count'] > 0) {
            return false;
        } else {
            return true;
        }
    }

    private function adicionarDocumentoPadre($iddocumento, $idpadre)
    {
        $documentoPadre = new DatDocumentoPadre();
        if (!$documentoPadre->verificarRelacionPadreHijo($iddocumento, $idpadre)) {
            $documentopadre = new DatDocumentoPadre();
            $documentopadre->idpadre = $idpadre;
            $documentopadre->iddocumento = $iddocumento;
            $documentopadre->save();
        }
    }

    public function generarordencita($datosDoc)
    {
        $conn = Doctrine_Manager::connection();
        $idoperacion = $this->getOperacionByCliente($datosDoc['idcliente']);
        if ($idoperacion) {
            $datosDoc['idoperacion'] = $idoperacion;
        }
        $datosDoc['iddoc'] = $this->iddoc;
        $doc = parent::adicionarDocumento($datosDoc);
        $idejercicio = $this->configuracionHelper
            ->getEjercicioActualSubsistema($this->idestructuracomun, $this->idSubsistema);
        $doc->nrodoc = ($datosDoc['iddocumento']) ? $doc->nrodoc : $this->devolverUltimoNumeroDoc(
            null, null, $idejercicio, 'nrodoc'
        );
        $doc->save();
        $this->adicionarDocumentoPadre($doc->iddocumento, $datosDoc['idcita']);
        parent::adicionarClientes(
            $doc->iddocumento, array(
            array('idcliente' => $datosDoc['idcliente'], 'tipocliente' => 1),
        ), true
        );
        $objOrdenTrabajo = new DatOrdenTrabajo();
        $idProducto = $datosDoc['idproducto'];
        $datosDoc['idproducto'] = $datosDoc['idindicador'];
        $datosDoc['fechainicio'] = $datosDoc['fechacita'];
        $datosDoc['fechafin'] = $datosDoc['fechaextimada'];
        $datosDoc['ordentrabajo'] = true;
        $datosMedio = $datosDoc['dinamicos'];

        $this->auxAdicionarOT($datosDoc, $doc, $idProducto, $objOrdenTrabajo, $datosMedio);
        if (!$datosDoc['iddocumento']) {
            $datosAdd = $this->_citasServices->cargarActividades($datosDoc);
            $listActividades['actividadesadd'] = $datosAdd['actividades'];
            $listMateriales['materialesadd'] = $datosAdd['materiales'];
        }
        $algunaExiste = $this->gestionarActividadesYMateriales($objOrdenTrabajo->idordentrabajo, $listActividades, $listMateriales, $integrarFac = 0);
        $parametros['iddocumento'] = $doc->iddocumento;
        $this->calcularImporteOT($doc->iddocumento);
        $docCompleto = $this->devolverOrdenesTrabajo($parametros);

        $docCompleto = $docCompleto['datos'][0];
        return array('iddocumento' => $doc->iddocumento,
            'fechacontable' => $doc->fechacontable, 'nrodoc' => $doc->nrodoc,
            'documento' => $docCompleto, 'algunaactvexistia' => $algunaExiste);
    }

    public function getContratos($params)
    {
        if ($params['criterio']) {
            $params['numerocontrato'] = $params['criterio'];
        }
        if (!$params['idclienteproveedor']) {
            unset($params['idclienteproveedor']);
        }
        $params['vigente'] = 1;
        $params['cliente'] = 1;
        //print_r($params);die;
        $arrayContrato = $this->crmHelper->getContratos($params);
        return array('datos' => $arrayContrato['data'], 'cantidad' => $arrayContrato['cant']);
    }

    public function agregarArea(&$dato)
    {
        if ($dato['idarea']) {
            $area = $this->getAreaById($dato['idarea']);
            if ($area) {
                $dato['denomarea'] = $area->denominacion;
            }
        }
    }

    public function getAreaById($idarea)
    {
        if ($idarea) {
            return $this->_serviciosEstructuraComp->getEstructura($idarea)[0];
        }
        return null;
    }

    public function agregarCentroDeCosto(&$dato)
    {
        if ($dato['idcentrodecosto']) {
            $centrocosto = $this->getCentroDeCostoById($dato['idcentrodecosto']);
            if ($centrocosto) {
                $dato['denomcentrocosto'] = $centrocosto->text;
            }
        }
    }

    public function getCentroDeCostoById($idCentroDeCosto)
    {
        if ($idCentroDeCosto) {
            $centrocosto = $this->contabilidadHelper->obtenerCentrosCostoFiltro(
                $this->idestructuracomun, 0, 10000,
                null, [$idCentroDeCosto]
            );
            return $centrocosto[0];
        }
        return null;
    }

    public function cargarAreasTaller($params)
    {
        $conn = Zend_Registry::get('conexion');
        $result = [];
        $idestructura = $this->global->Estructura->idestructura;
        $select = "SELECT ett.idestructuraop as idarea, ett.denominacion, count(ett.idestructuraop) over() as cantidad";
        $from = "FROM mod_estructuracomp.dat_estructuraop ett";
//        $where = "WHERE co.idestructura = {$params['idestructura']}";
        $groupby = "group by ett.idestructuraop, ett.denominacion";
        $orderby = "order by ett.denominacion";

        $limit = "";
        if ($params['limit']) {
            $limit .= "LIMIT {$params['limit']} ";
        }
        if ($params['start']) {
            $limit .= "OFFSET {$params['start']}";
        }

        if ($params['areasconf']) {
            $from .= " inner join mod_logtaller.conf_servicioarea sa on(ett.idestructuraop = sa.idarea)";
            $where = "WHERE sa.idestructuracomun = $idestructura";
            $result = $conn->fetchAll("
                $select
                $from
                $where
                $groupby
                $orderby
                $limit
            ");
        } else if ($params['areasuti']) {
            $from .= " inner join mod_logtaller.dat_ordenactividad oa on(ett.idestructuraop = oa.idarea)";
            $from .= " inner join mod_logistica.dat_documento ld on(oa.idordentrabajo = ld.iddocumento)";
            $where = "WHERE ld.idestructuracomun = $idestructura";
            $result = $conn->fetchAll("
                $select
                $from
                $where
                $groupby
                $orderby
                $limit
            ");
        }

        return ['datos' => $result, 'cantidad' => count($result) > 0 ? $result[0]['cantidad'] : 0];
    }

    /**
     * Método para devolver los documentos generados por una orden de trabajo
     *
     * @params array $datosDoc Arreglo con los parametros para filtrar los documentos
     *
     * @return array
     */
    public function devolverDocumentosGenerados($datosDoc = array(), $dql = false, $doc = 'd')
    {
        $conn = Doctrine_Manager::connection();

        $iddocumento = $datosDoc['idpadre'] ? $datosDoc['idpadre'] : $datosDoc['iddocumento'];

        $addWhere = "";
        $innerProducion = $innerEntrega = $innerDevolucion = $innerRecepcion = "";
        if ($datosDoc['criterio']) {
            $addWhere = " AND {$doc}.nrodoc = {$datosDoc['criterio']}";
        }
        if ($datosDoc['factura']) {
            $query = "select d.iddocumento,es.idestructuracomun,ndp.denominacion as tipodocumento, d.nrodoc as nrodoc, d.numeroref as numeroref, d.estado as estado, d.fechacontable, 
            ddc.tipocliente AS tipocliente, ddc.iddocumentocliente as iddocumentocliente, ddc.idcliente 
            from mod_logistica.dat_documento d
                 inner join mod_logistica.dat_documentocliente ddc on ddc.iddocumento = d.iddocumento     
                 inner join mod_datosmaestros.dat_documentoprim dp on dp.iddoc = d.iddoc            
                 inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = dp.iddocumentos
                 inner join mod_datosmaestros.dat_estructurasubsist es on es.idestructurasubsist = dp.idestructurasubsist
                 inner join mod_logistica.dat_documentopadre ddp on ddp.iddocumento = d.iddocumento
                 where ddp.idpadre = {$datosDoc['iddocumento']} and d.estado in (1,2,3,4) AND ndp.abreviatura in ('facturaLog')
                 Group by  d.iddocumento,ndp.denominacion,es.idestructuracomun,d.nrodoc,d.numeroref,d.estado, d.fechacontable,ddc.tipocliente, ddc.iddocumentocliente,ddc.idcliente
                 order by  ddc.iddocumentocliente
            ";
        }
        if ($datosDoc['valeentrega']) {
            $query = "select d.iddocumento,es.idestructuracomun,ndp.denominacion as tipodocumento, d.nrodoc as nrodoc, d.numeroref as numeroref, d.estado as estado, d.fechacontable, 
            ddc.tipocliente AS tipocliente, ddc.iddocumentocliente as iddocumentocliente, ddc.idcliente
            from mod_logistica.dat_documento d
                 inner join mod_logistica.dat_documentocliente ddc on ddc.iddocumento = d.iddocumento     
                 inner join mod_datosmaestros.dat_documentoprim dp on dp.iddoc = d.iddoc            
                 inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = dp.iddocumentos
                 inner join mod_datosmaestros.dat_estructurasubsist es on es.idestructurasubsist = dp.idestructurasubsist
                 inner join mod_logistica.dat_documentopadre ddp on ddp.iddocumento = d.iddocumento
                 where ddp.idpadre = {$datosDoc['iddocumento']} and d.estado in (1,2,3,4) AND ndp.abreviatura in ('valeLog')
               
            ";
        }
        if ($datosDoc['valedevolucion']) {
            $query = "SELECT distinct d.iddocumento AS iddocumento,
            d.nrodoc AS nrodoc,
            d.numeroref AS numeroref,
            d.fechacontable AS fechacontable,
            d.idestructuracomun AS idestructuracomun,
            m8.denominacion AS tipodocumento,
            d.estado AS estado,
            m9.denominacion AS deposito,m4.nrodoc as valeentrega
     FROM mod_logtaller.dat_ordentrabajo  m
          INNER JOIN mod_logistica.dat_documento m2 ON (m2.iddocumento = m.idordentrabajo)
          INNER JOIN mod_logistica.dat_documentopadre m3 ON (m3.idpadre = m2.iddocumento)
          INNER JOIN mod_logistica.dat_documento m4 ON (m4.iddocumento = m3.iddocumento)
          INNER JOIN mod_logistica.dat_documentopadre m5 ON (m5.idpadre = m4.iddocumento)
          INNER JOIN mod_logistica.dat_documento d ON (d.iddocumento = m5.iddocumento)
          LEFT JOIN mod_datosmaestros.dat_documentoprim m7 ON (m7.iddoc = d.iddoc)
          LEFT JOIN mod_datosmaestros.nom_docprim m8 ON (m8.iddocumentos = m7.iddocumentos)
          LEFT JOIN mod_estructuracomp.dat_estructuraop m9 ON (m9.idestructuraop = d.idestructuracomun)
     WHERE (m.idordentrabajo = {$datosDoc['iddocumento']} AND
           d.estado in (4))";
        }


        if ($datosDoc['limit']) {
            $query .= " offset {$datosDoc['start']} limit {$datosDoc['limit']} ";
        }
        $conn = Zend_Registry::get('conexion');
        $datas = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return array(
            'datos' => $datas,
            'cantidad' => count($data)
        );
    }

    public function cargarProductosEjecucion($params)
    {
        $filtro = "";
        if ($params['criterio']) {
            if (is_numeric($params['criterio'])) {
                $filtro = "AND i.codigo ilike '%{$params['criterio']}%'";
            } else {
                $filtro = "AND i.denominacion ilike '%{$params['criterio']}%'";
            }
        }

        $innerEntrega = $innerDevolucion = $innerFactura = "";
        $selectipo = "";

        if ($params['factura']) {
            $selectipo = ",(CASE WHEN dps.tipo = 1 THEN 'Productos' ELSE 'Servicios' END)as tipo,def.cantidad as cantidad,def.preciotarifabase as precio,
        (CASE WHEN def.importe is not null THEN def.importe ELSE def.cantidad * def.preciotarifabase END) as importe ";
            $innerFactura = "
        mod_logistica.dat_documento  doc 
        INNER JOIN mod_logfacturacion.dat_docfactura ddf on ddf.idfactura = doc.iddocumento
        INNER JOIN mod_logfacturacion.dat_elementosfactura def on def.idfactura = ddf.idfactura
        INNER JOIN mod_logfacturacion.dat_prodservnomenclador dps on dps.idelementofactura = def.idelementofactura
        LEFT JOIN mod_logistica.dat_movimiento dm ON dm.iddocumento = doc.iddocumento
    LEFT JOIN mod_datosmaestros.nom_indicador i on i.idindicador = dps.idindicador 
    LEFT JOIN mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = i.idumedida
    Where doc.iddocumento = {$params['iddocumento']} 
    group by dps.tipo, um.abreviaturaunidadmedida,i.idindicador,i.numeropieza,i.codigo,i.denominacion,dm.cantidad,i.idumedida,def.preciotarifabase,def.importe,def.cantidad ";
        } else if ($params['valedevolucion']) {
            $selectipo = ",'Productos' as tipo,tp.cantidad as cantidad,tp.preciocontable as precio,(tp.cantidad * tp.preciocontable)as importe";
            $innerDevolucion = "
         mod_logistica.dat_documento doc 
        LEFT JOIN mod_logistica.dat_movimiento tp ON tp.iddocumento = doc.iddocumento
        LEFT JOIN mod_logistica.dat_producto dp ON dp.idproducto = tp.idproducto
        LEFT JOIN mod_datosmaestros.nom_indicador i on i.idindicador = dp.idindicador 
        LEFT JOIN mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = i.idumedida
        where doc.iddocumento = '{$params['iddocumento']}'
        ";
        } else {
            $selectipo = ",'Productos' as tipo,tp.cantidad as cantidad,tp.preciocontable as precio,(tp.cantidad * tp.preciocontable)as importe";
            $innerEntrega = "mod_logistica.dat_documento doc 
        LEFT JOIN mod_logistica.dat_movimiento tp ON tp.iddocumento = doc.iddocumento
        LEFT JOIN mod_logistica.dat_producto dp ON dp.idproducto = tp.idproducto
        LEFT JOIN mod_datosmaestros.nom_indicador i on i.idindicador = dp.idindicador 
        LEFT JOIN mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = i.idumedida
        where doc.iddocumento = {$params['iddocumento']}";
        }

        $conn = Doctrine_Manager::connection();
        $query = "SELECT i.numeropieza as codigoproveedor, i.codigo as codigo, i.denominacion as text, i.idumedida, 
            um.abreviaturaunidadmedida as umedida, i.idindicador $selectipo
            FROM $innerFactura $innerEntrega $innerDevolucion $filtro";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);

        if ($params['limit']) {
            $query .= " offset {$params['start']} limit {$params['limit']} ";
        }
        $conn = Zend_Registry::get('conexion');
        $datas = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return array(
            'datos' => $datas,
            'cantidad' => count($data)
        );
    }

    public function getActividadesSinTecnico($iddocumento)
    {
        return LogisticaDoctrineHelper::__init()->getConnection()->execute("
        select oa.idordenactividad, ca.denominacion
        from mod_logtaller.dat_ordentrabajo ot
        inner join mod_logtaller.dat_ordenactividad oa on(oa.idordentrabajo = ot.idordentrabajo)
        inner join mod_logtaller.conf_actividad ca on (oa.idactividad = ca.idactividad)
        where ot.idordentrabajo = {$iddocumento}
        and oa.idresponsable is null
        group by oa.idordenactividad, ca.denominacion
    ")->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getEstructuras() {
        $estructuras = ServiciosEstructuraComposicionHelper::__init()->obtenerEstructuras();
        return array('datos'=>$estructuras, 'cantidad'=>count($estructuras));
    }

    public function verificarEntidades($params) {
        $resp = LogisticaDoctrineHelper::__init()->getConnection()->execute("
            select count(dm.idmaterial)
            from mod_logtaller.dat_material dm
            where dm.idordentrabajo = {$params['iddocumento']}
            and dm.idestructuracomun <> {$this->idestructuracomun} and dm.transferido = 0
        ")->fetchAll(PDO::FETCH_ASSOC);
        if ($resp[0]['count']) {
            return array('entidadesexternas'=>true);
        } else {
            return true;
        }
    }

    public function procesarMaterialesExternos($params) {
        $respuesta = $this->doctrineHelper->getConnection()->execute(
            "SELECT * from mod_logtaller.fn_procesarordentrabajo({$params['iddocumento']}, $this->idusuario)"
        )->fetchAll(PDO::FETCH_ASSOC);
        return true;
    }

}
