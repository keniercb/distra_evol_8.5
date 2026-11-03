<?php

/**
 * @class     CitasTalleresModel
 * @package   Talleres
 * @author    Nardy Román Padrón
 * @copyright XETID
 * @version   1.0
 */
class CitasTalleresModel extends DocumentoLogisticaModel
{
    private $_serviciosRecursosHumanos, $_serviciosPlanificacion, $_serviciosConfiguracionGeneral,
        $_serviciosEstructuraComp, $_ppaService, $_aperturaAFT, $_aperturaFAC, $_utilesServices,
        $_solicitudServices, $_docAFTServices, $_maestro;

    public function __construct($datosDoc = array(), $aperturaAFT = false)
    {
        $datosDoc['subsistema'] = LogisticaGlobal::SUBSISTEMA_TALLERES;
        parent::__construct($datosDoc);
        $this->_maestro = new MaestroProductoModel();
        $this->_aperturaFAC = ($datosDoc['aperturadoFAC']) ? $datosDoc['aperturadoFAC'] : false;
        $this->idestructuracomun = $this->global->Estructura->idestructura;
//        $this->_solicitudServices = new SolicitudService();

        $relationsIndicadorCitas[] = array(
            'cardinalidad' => 'many', 'relation' => 'NomIndicador',
            'properties' => array('local' => 'idindicador', 'foreign' => 'idindicador'
            )
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatCita(), $relationsIndicadorCitas);
        $relationsPiezasCitas[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatPiezadispCita',
            'properties' => array('local' => 'idcita', 'foreign' => 'idcita'
            )
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatCita(), $relationsPiezasCitas);
        $relationsActividadCitas[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatActividadCita',
            'properties' => array('local' => 'idcita', 'foreign' => 'idcita'
            )
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatCita(), $relationsActividadCitas);

        $relationsServicioCitas[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatServicioCita',
            'properties' => array('local' => 'idcita', 'foreign' => 'idcita'
            )
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatCita(), $relationsServicioCitas);

        $relationsDatCita[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatCita',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'idcita'
            )
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatDocumento(), $relationsDatCita);
        $relations[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatPlansolicitud',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'idplansolicitud'
            )
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatDocumento(), $relations);
        $relations[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatDocumentocl',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'iddocumento'
            )
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatDocumento(), $relations);
        $relationsConfActividadActCita[] = array(
            'cardinalidad' => 'one', 'relation' => "ConfActividad",
            'properties' => array('local' => 'idindicador', 'foreign' => 'idindicador')
        );
        $this->doctrineHelper->tryInyectRelactions(new DatActividadCita(), $relationsConfActividadActCita);
        /*$relationsActCitaInd[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatActividadCita',
            'properties' => array('local' => 'idindicador', 'foreign' => 'idindicador')
        );
        $this->doctrineHelper->tryInyectRelactions(new NomIndicador, $relationsActCitaInd);*/

        $relationsConfActividad[] = array(
            'cardinalidad' => 'many', 'relation' => 'ConfActividad',
            'properties' => array('local' => 'idactividad', 'foreign' => 'idactividad'
            )
        );
        $this->logisticaDoctrine->tryInyectRelactions(new ConfNorma(), $relationsConfActividad);
        $this->_aperturaAFT = $aperturaAFT;
        if (class_exists('DatPedido')) {
            $relationsPed[] = array(
                'cardinalidad' => 'one', 'relation' => 'DatPedidoOrdenTrabajo',
                'properties' => array('local' => 'iddocumento', 'foreign' => 'idpedido')
            );
            $this->doctrineHelper->tryInyectRelactions(new DatPedido, $relationsPed);
        }
        $this->_serviciosRecursosHumanos = ServiciosRecursosHumanosHelper::__init();
        $this->_serviciosPlanificacion = ServiciosPlanificacionHelper::__init();
        $this->_serviciosConfiguracionGeneral = ServiciosConfiguracionGeneralHelper::__init();
        $this->_serviciosEstructuraComp = ServiciosEstructuraComposicionHelper::__init();
        if ($aperturaAFT) {
//            $this->_ppaService = new ParetesPiezasAgregadosService();
//            $this->_utilesServices = $this->_solicitudServices->getUtilesServices();
//            $this->_docAFTServices = $this->_solicitudServices->getDocAFTServices();
            $relationsRegNumAct[] = array(
                'cardinalidad' => 'one', 'relation' => 'DatRegnumericoActivo', 'properties' => array(
                    'local' => 'idproducto', 'foreign' => 'idregnumerico'
                )
            );
            $this->doctrineHelper->tryInyectRelactions(new DatMedio, $relationsRegNumAct);

            $relationsDatProd[] = array(
                'cardinalidad' => 'one', 'relation' => 'CfgPlanificacionMantenimiento', 'properties' => array(
                    'local' => 'idindicador', 'foreign' => 'idindicador'
                )
            );
            $this->doctrineHelper->tryInyectRelactions(new DatProductoLogistica, $relationsDatProd);

            /*$relationsCfgPlanificacionMantenimiento[] = array(
                'cardinalidad' => 'one', 'relation' => 'DatMedio', 'properties' => array(
                    'local' => 'idindicador', 'foreign' => 'idindicador'
                )
            );
            $this->doctrineHelper->tryInyectRelactions(new CfgPlanificacionMantenimiento, $relationsCfgPlanificacionMantenimiento);*/

        }
    }

    /**
     * @method devuelve un array o el DQL de las Citas.
     * @param array $parametros
     * @param bool $dqlResult
     *
     * @return array|Doctrine_Query
     */
    public function devolverCitas($parametros = array(), $dqlResult = false)
    {
        $aux = "";
        if ($parametros['iddeposito']) {
            $aux = "and mat.iddeposito = {$parametros['iddeposito']} ";
        }
        $subQueryPiezas = "(SELECT count(dpd.disponible)
            FROM DatPiezadispCita dpd WHERE dpd.idcita = dc.idcita and dpd.disponible > 0
            " . $aux . ")
            as cant_piezasdisponibles";
        $subQueryCantPiezasTienePrecio = "(SELECT count(dpd2.idpiezadispcita)
            FROM DatPiezadispCita dpd2 WHERE dpd2.idcita = dc.idcita and dpd2.precioventa > 0) as CantPiezasConPrecio";

        $subQueryCantActv = "(SELECT count(actc.idactividadcita)
            FROM DatActividadCita actc WHERE actc.idcita = dc.idcita) as cantactvidades";

        $subQueryCantActvTienePrecioAct = "(SELECT count(actc2.idactividadcita)
            FROM DatActividadCita actc2 WHERE actc2.idcita = dc.idcita and actc2.precioventa > 0) as CantActConPrecio";
        $subQueryselectproducto = "(SELECT ind1.denominacion FROM NomIndicador ind1 WHERE dc.idindicador = ind1.idindicador) as producto";
        //Pa que no sea obligatorio registrar la solucion para cerrar la C
        $subQuerySolucion = " 1 as solucion";

        $subImporteTotalAct = "COALESCE((SELECT coalesce(sum(dpd3.importe),0)+(SELECT coalesce(sum(actc3.importe),0)
 FROM DatActividadCita actc3 WHERE actc3.idcita = dc.idcita)
FROM DatPiezadispCita dpd3  WHERE dpd3.idcita = dc.idcita),0) as importetotal";

        $objPedido = $this->documentosHelper->devuelveIddocByIdEstructura(
            'pedido', $this->idestructuracomun, LogisticaGlobal::SUBSISTEMA_DIST
        );
        /*$subQueryPedido = "(CASE WHEN ddd.iddocumento is not null and ddd.iddoc = {$objPedido->iddoc} THEN COALESCE(CONCAT('DOC-', ddd.nrodoc), CONCAT('REF-', ddd.numeroref)) ELSE '-' END) as nropedido";*/

        $subQueryPedido = "(SELECT ARRAY_TO_STRING(ARRAY_AGG(CASE WHEN ddd.nrodoc IS NOT NULL THEN CONCAT('DOC-', ddd.nrodoc) ELSE CONCAT('REF-', ddd.numeroref) END),', ') 
                            FROM DatDocumento ddd INNER JOIN ddd.DatDocumentoPadre ddp ON ddp.iddocumento = ddd.iddocumento 
                            WHERE ddp.idpadre = d.iddocumento AND ddd.iddoc = {$objPedido->iddoc}) as nropedido";

        //$subTienePedidos = "(CASE WHEN ddd.iddocumento is not null and ddd.iddoc = {$objPedido->iddoc} THEN 1 ELSE 0 END) AS pedido";
        $subTienePedidos = "(SELECT (CASE WHEN COUNT(ddd1.iddocumento) > 0 THEN 1 ELSE 0 END) FROM DatDocumento ddd1 INNER JOIN ddd1.DatDocumentoPadre ddp1 ON ddp1.iddocumento = ddd1.iddocumento 
                            WHERE ddp1.idpadre = d.iddocumento AND ddd1.iddoc = {$objPedido->iddoc}) AS pedido";

        //$subTieneCL = "(CASE WHEN ddcl.iddocumentocl is not null THEN 1 ELSE 0 END) AS capacidadliquida";

        $subTieneCL = "(SELECT (CASE WHEN COUNT(ddcl.iddocumento) > 0 THEN 1 ELSE 0 END) FROM DatDocumentocl ddcl WHERE ddcl.iddocumento = d.iddocumento) AS capacidadliquida";

        $integrator = ZendExt_IoC::getInstance();
        $integrator->metadatos->obtenerIUEstructura();

        $selectCita = "CONCAT(d.nrodoc, '.', (SELECT eop.codigo FROM NomFilaestruc f   
            LEFT JOIN f.DatEstructuraop eop ON eop.idestructuraop = f.idfila AND eop.idproyecto = 0
            WHERE f.idfila = d.idestructuracomun) ,'.', d.anno) as nrodoc, dc.idcita as idcita, dc.idcliente as idcliente,dc.correo as correo ,dc.correo as correocliente,dc.telefono as telefono,dc.observacion as observacion,
            dc.dinamicos as dinamicos,dc.fechacita as fechacita,dc.fechaextimada as fechaextimada,dc.nombreresponsable as nombreresponsable,dc.idcarnetresponsable as idcarnetresponsable,
            dc.telefonoresponsable as telefonoresponsable,dc.textocorreoresponsable as textocorreoresponsable,
            dc.idindicador as idindicador,dc.idpadreindicador as idpadreindicador, dc.idplanificacionmantenimiento as idplanificacionmantenimiento,
            dc.cerradopor as cerradopor,dc.fechadocumento as fechadocumento,dc.horaentrada as horaentrada, 
            {$subQueryPiezas},{$subQueryCantPiezasTienePrecio}, {$subQueryCantActv},{$subQueryCantActvTienePrecioAct},{$subQuerySolucion},{$subQueryselectproducto}
            ,{$subImporteTotalAct},{$subQueryPedido},{$subTienePedidos},{$subTieneCL}";

        $selectServicio = " dcd.idservicio as idservicio";
        $selectActividades = " actc1.duracion as duracion,
        dc.idtipoprecioactividad as idtipoprecioactividad";

        $selectPiezasDisp = "dpd1.dias as dias,dc.idtipopreciopiezas as idtipopreciopiezas";

        $parametros['idestructura'] = ($parametros['idestructura']) ? $parametros['idestructura'] : $this->idestructuracomun;
        if ($parametros['idcentrocosto']) {
            $parametros['idcliente'] = $parametros['idcentrocosto'];
            $parametros['tipocliente'] = LogisticaGlobal::TIPO_CLIENTE_CENTRO;
        }

        if ($parametros['idestado']) {
            $parametros['estado'] = explode(',', $parametros['idestado']);
        }

        $dql = parent::devolverDocumentos($parametros);
        $dql->addSelect(
            "(SELECT cc.idcliente FROM DatDocumentoCliente cc " .
            "WHERE cc.iddocumento = d.iddocumento and cc.tipocliente = 2 LIMIT 1) as idcentrocosto"
        );
        $dql->addSelect(
            "(SELECT cc1.idcliente FROM DatDocumentoCliente cc1 " .
            "WHERE cc1.iddocumento = d.iddocumento and cc1.tipocliente = 1 LIMIT 1) as idcliente"
        );

        if ($parametros['recuperaciones']) {
            //$dql->addSelect("ddd.nrodoc as nroorden");
        }

        $dql->innerJoin('d.DatCita dc')->addSelect($selectCita)
            ->leftJoin('dc.DatServicioCita dcd')->addSelect($selectServicio)
            ->leftJoin('dc.NomIndicador ind')
            ->leftJoin('ind.NomIndicadorhoja indh')
            /*->leftJoin('dc.DatDocumento doc')
            ->leftJoin("d.DatDocumentoPadre ddp on ddp.idpadre = d.iddocumento")
            ->leftJoin("ddp.DatDocumento ddd on ddp.iddocumento = ddd.iddocumento")
            ->leftJoin('ddd.DatDocumentoprim dp')
            ->leftJoin("d.DatDocumentocl ddcl")*/;

        $this->_maestro->addQueryJoinMarcaModelo($dql, 'indh', 'nmar', 'nm', true, true, 'ind');
        $this->filtrosAuxialiares($dql, $parametros, $subImporteTotalAct);

        /*if ($parametros['pedido']) {
            if ($parametros['pedido'] == true) {
                $dql->addWhere(" ddd.iddocumento is not null and ddd.iddoc = {$objPedido->iddoc}");
            } else {
                $dql->addWhere(" ddd.iddocumento is null");
            }
        }*/

        $this->logisticaDoctrine->addQueryLimits($dql, $parametros);
        /*$usuario = $this->cargaInicial();*/
        if ($dqlResult) {
            return $dql;
        } else {
            $result = $dql->fetchArray();
            $this->cargarClientesDocumentos($result);
            return array('cantidad' => $dql->count(), 'datos' => $result/*, 'usuarios' => $usuario*/);
        }
    }

    /**
     * @method devuelve un array de las actividades por citas.
     * @param array $parametros
     *
     * @return array|Doctrine_Query
     */
    public function cargarActividades($params)
    {

        $query = Doctrine_Query::create();
        /*        $servicios = ($params['idservicio']) ? explode(',', $params['idservicio']) : null;
                if ($servicios) {
                    $asExt = "ca";
                    $query->select("$asExt.idactividad as idactividadcita, $asExt.denominacion as denominacion, $asExt.duracion as duracion
                    ")
                        ->from("ConfActividad ca")
                        ->whereIn(
                            "ca.idarbol ", $servicios
                        )
                        ->andWhereIn("ca.idpadre", $servicios)
                        ->andWhere(" $asExt.duracion <> 0");
                    $maestroProducto = new MaestroProductoModel();
                    $maestroProducto->addQueryNomIndicador($query, $asExt, 'i', 'ih', $select = true, false, 1, true);
                } else*/

        if ($params['idcita'] != null) {

            $asExt = "dac";
            if ($params['ordentrabajo']) {
                $query->select(" $asExt.idactividadcita, ca.idactividad as idactividad,
               $asExt.idcita as idcita, $asExt.precioventaalternativo as precioalternativo,
               $asExt.duracion as tiemporeal, $asExt.duracion as tiempoplanificado,$asExt.idindicador as idindicador, $asExt.precioventa as precio, 
                 $asExt.importealternativo as importealternativo");
            } else {
                $query->select(" $asExt.idactividadcita, ca.idactividad as idactividad,
                $asExt.duracion as duracion,$asExt.idcita as idcita,$asExt.precioventa as precioventa,$asExt.importe as importe,$asExt.precioventaalternativo as precioventaalternativo,
                $asExt.importealternativo as importealternativo,$asExt.codigo as codigo");
            }

                $query->from("DatActividadCita $asExt")
                ->leftJoin("$asExt.ConfActividad ca")
                ->where('idcita =?', array($params['idcita']));

            $maestroProducto = new MaestroProductoModel();
            $maestroProducto->addQueryNomIndicador($query, $asExt, 'i', 'ih', $select = true, false, 1, true);
            if ($params['criterio']) {
                $query->addWhere(
                    "( $asExt.denominacion ilike '%{$params['criterio']}%' "
                    . " OR $asExt.codigo ilike '%{$params['criterio']}%')"
                );
            }


            $cantidad = $query->count();
            if ($params['start']) {
                $query->offset($params['start']);
            }

            if ($params['limit']) {
                $query->limit($params['limit']);
            }

            $datos = $query->fetchArray();
        }
        return array(
            'datos' => $datos,
            'cantidad' => $cantidad
        );
    }

    /**
     * @method Filtrar
     * @param $dql
     * @param $parametros
     *
     * @return Doctrine_Query
     */
    private function filtrosAuxialiares(Doctrine_Query $dql, $parametros, $importeTotal)
    {
        $objIddocOrden = $this->documentosHelper->devuelveIddocByIdEstructura(
            'ordenServicioLOG', $this->idestructuracomun, LogisticaGlobal::SUBSISTEMA_TALLERES
        );

        if ($parametros['idindicador']) {
            if (is_array($parametros['idindicador'])) {
                $dql->andWhereIn("dc.idindicador ", $parametros['idindicador']);
            } else {
                $dql->addWhere("dc.idindicador = ? ", array($parametros['idindicador']));
            }
        };
        if ($parametros['idproducto']) {//id del registro numerico
            $dql->addWhere("dc.idproducto = ? ", array($parametros['idproducto']));
        };
        if ($parametros['idservicio']) {
            $parametros['servicio'] = explode(',', $parametros['idservicio']);
            $dql->andWhereIn("dcd.idservicio  ", $parametros['servicio']);
        };
        if ($parametros['criterio']) {
            if (is_numeric($parametros['criterio'])) {
                $dql->addWhere("d.nrodoc = ?", $parametros['criterio']);
            }
        }

        if ($parametros['recuperaciones']) {
            if ($parametros['cordentrabajo']) {
                $dql->addWhere("(SELECT COUNT(dda.iddocumento) FROM DatDocumento dda
                                    INNER JOIN dda.DatDocumentoPadre ddpa ON ddpa.iddocumento = dda.iddocumento
                                    WHERE ddpa.idpadre = d.iddocumento AND dda.iddoc = {$objIddocOrden->iddoc}) > 0");
            }
            if ($parametros['sordentrabajo']) {
                $dql->addWhere("(SELECT COUNT(dda.iddocumento) FROM DatDocumento dda
                                    INNER JOIN dda.DatDocumentoPadre ddpa ON ddpa.iddocumento = dda.iddocumento
                                    WHERE ddpa.idpadre = d.iddocumento AND dda.iddoc = {$objIddocOrden->iddoc}) = 0");
            }
            if ($parametros['capacidadliquida']) {
                $dql->addWhere("ddcl.iddocumento is not null");
            }
        }

        if ($parametros['estadoCita']) {
            $dql->addWhere("d.estado = ?", ($parametros['estadoCita']));
            $dql->addWhere("(SELECT COUNT(dda.iddocumento) FROM DatDocumento dda
                                    INNER JOIN dda.DatDocumentoPadre ddpa ON ddpa.iddocumento = dda.iddocumento
                                    WHERE ddpa.idpadre = d.iddocumento AND dda.iddoc = {$objIddocOrden->iddoc}) = 0");
        }

        if ($parametros['fechacita']) {
            $dql->addWhere("dc.fechacita = ?", array($parametros['fechacita']));
        }

        if ($parametros['fechaterminacion']) {
            $dql->addWhere("dc.fechaextimada = ?", array($parametros['fechaterminacion']));
        }

        if ($parametros['desdeBA']) {
            $dql->addWhere("dc.fechacita >= ?", array($parametros['desdeBA']));
        }
        if ($parametros['hastaBA']) {
            $dql->addWhere("dc.fechacita <= ?", array($parametros['hastaBA']));
        }

        if ($parametros['desdeDOC']) {
            $dql->addWhere("d.fechacontable >= ?", array($parametros['desdeDOC']));
        }
        if ($parametros['hastaDOC']) {
            $dql->addWhere("d.fechacontable <= ?", array($parametros['hastaDOC']));
        }

        if ($parametros['cliente']) {
                $dql->addWhere("dc.idcliente = ?", array($parametros['cliente']));
        }
        if ($parametros['fechadocumento']) {
            $dql->addWhere("dc.fechadocumento = ?", array($parametros['fechadocumento']));
        };

        if ($parametros['nroorden']) {
            $dql->addWhere("ddd.nrodoc in ({$parametros['nroorden']})");
        }

        if ($parametros['orderby']) {
            $dql->orderBy("d.{$parametros['orderby']}");
        }

        return $dql;
    }

    /**
     * @method Adicionar documento gestionar cita
     * @param       $listActividades
     * @param       $listPiezasDisp
     * @param       $datosMedio
     * @param array $datosDoc
     *
     * @return array
     */
    public function adicionarCita($listActividades, $listPiezasDisp, $datosMedio, $datosDoc = array())
    {

        if (true) {

            //Abrir varias citas al mismo medio a la vez
            $objCita = new DatCita();
            if (!$datosDoc['idcita']) {
                $doc = parent::adicionarDocumento($datosDoc);
                $idejercicio = $this->configuracionHelper
                    ->getEjercicioActualSubsistema($this->idestructuracomun, $this->idSubsistema);
                $doc->nrodoc = ($datosDoc['iddocumento']) ? $doc->nrodoc : $this->devolverUltimoNumeroDoc(
                    null, null, $idejercicio, 'nrodoc'
                );
                $doc->save();
                parent::adicionarClientes(
                    $doc->iddocumento, array(
                    array('idcliente' => $datosDoc['idcliente'], 'tipocliente' => 1),
                    array('idcliente' => $datosDoc['idcentrocosto'], 'tipocliente' => 2)
                ), true);

                $datosDoc['idcita'] = $doc->iddocumento;
                /*$datosDoc['idproducto'] = $datosDoc['idindicador'];*/

            } else {
                $objCita->assignIdentifier($datosDoc['idcita']);
            }
            $this->auxAdicionarCita($datosDoc, $doc, $objCita, $datosMedio, $listActividades, $listPiezasDisp);
            if ($datosDoc['idservicio']) {
                $this->AdicionarServicioCita($datosDoc['idcita'], $datosDoc, $listActividades, $listPiezasDisp);
            }
            $cantAct = $this->gestionarActividadesYListPiezas($datosDoc, $listActividades, $listPiezasDisp);
            $this->enviarCorreo($datosDoc);
            return array ('documento' => array('iddocumento'=> $datosDoc['idcita'], 'estado' => ($doc->estado) ? $doc->estado : '1',
                'cantactvidades'=> $cantAct ? $cantAct : $this->cantidadActividades($datosDoc['idcita']), 'CantActConPrecio' => $this->cantidadConprecio($datosDoc['idcita']) ,'idcliente'=>$datosDoc['idcliente']));
        } else {

            return array('identificadorduplicado' => true);
        }
    }

    public function cantidadConprecio($idcita)
    {
        $dql = Doctrine_Query::create();
        $selectCita = "(SELECT count(actc2.idactividadcita)
            FROM DatActividadCita actc2 WHERE actc2.idcita = dc.idcita and actc2.precioventa > 0) as CantActConPrecio";

        $dql->from('DatCita dc')->addSelect($selectCita)->addWhere('dc.idcita = ?', array($idcita));
        $result = $dql->fetchArray();
       return $result[0]['CantActConPrecio'];
    }

    public function cantidadActividades($idcita)
    {
        $dql = Doctrine_Query::create();
        $selectCita = "(SELECT count(actc2.idactividadcita)
            FROM DatActividadCita actc2 WHERE actc2.idcita = dc.idcita) as CantAct";

        $dql->from('DatCita dc')->addSelect($selectCita)->addWhere('dc.idcita = ?', array($idcita));
        $result = $dql->fetchArray();
        return $result[0]['CantAct'];
    }

    public function eliminarCapacidadLiquidaCita($iddocumento, $idindicador)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "DELETE FROM 
                  mod_logistica.dat_documentocl 
                WHERE 
                  iddocumento = $iddocumento
                 and idindicador = $idindicador
                ;";
        return $conn->fetchAll($sql);
    }

    public function getActividadesServicio($idservicio, $idtipoprecio, $tiemporeal, $listActividades, $arraydatosDoc)
    {
        $conn = Doctrine_Manager:: connection();
        $sql = "select cs.* from mod_logtaller.conf_actividad cs where cs.idpadre =({$idservicio})";
        $actividades = $conn->execute($sql)
            ->fetchAll(PDO::FETCH_ASSOC);
        $materiales = array();
        foreach ($actividades as &$d) {
            $monedas = LogisticaGlobal::__init()->getMonedaEntidad();
            $facServi = new FacturacionService();
            $parametros = null;
            $parametros->idindicador = $d['idindicador'];
            $parametros->idtipoprecio = $idtipoprecio;
            $precio = $facServi->getPrecioVentaIndicador($parametros);
            $d['precio'] = ($precio['datos'][$monedas->idmoneda]) ? $precio['datos'][$monedas->idmoneda]['precioventa'] : 0;
            $d['precioalternativo'] = ($precio['datos'][$monedas->idmonedaalternativa]) ? $precio['datos'][$monedas->idmonedaalternativa]['precioventa'] : 0;
            $d['idtipoprecio'] = $idtipoprecio;
//            $d['importealternativo'] = $listActividades['tiemporeal'] * $d['precio'];

            foreach ($listActividades as $l) {
                if ($l['idactividad'] == $d['idactividad']) {
                    $d['fechainicio'] = $l['fechainicio'] ? $l['fechainicio'] : $d['fechainicio'];
                    $d['fechafin'] = $l['fechafin'] ? $l['fechafin'] : $d['fechafin'];
                    $d['idresponsable'] = $l['idresponsable'] ? $l['idresponsable'] : $d['idresponsable'];
                    $d['observacion'] = $l['observacion'] ? $l['observacion'] : $d['observacion'];
                    $d['tiemporeal'] = $l['tiemporeal'] ? $l['tiemporeal'] : $d['tiemporeal'];
                    $d['costo'] = $l['tiemporeal'] * $d['precio'];
                    $d['importealternativo'] = $l['tiemporeal'] * $d['precioalternativo'];


                }

            }

            if (empty($listActividades) && $arraydatosDoc['iddocumento']) {
                $sql = "select cs.*,fechainicio,fechafin,idresponsable,observacion,tiemporeal,costo,idarea
                from mod_logtaller.conf_actividad cs inner join mod_logtaller.dat_ordenactividad oa on (cs.idactividad = oa.idactividad)
                where cs.idpadre =({$idservicio}) and oa.idordentrabajo = ({$arraydatosDoc['idordentrabajo']})";
                $actividadesguardadas = $conn->execute($sql)
                    ->fetchAll(PDO::FETCH_ASSOC);
                foreach ($actividadesguardadas as $a) {
                    if ($a['idactividad'] == $d['idactividad']) {
                        $d['fechainicio'] = $a['fechainicio'];
                        $d['fechafin'] = $a['fechafin'];
                        $d['idresponsable'] = $a['idresponsable'];
                        $d['observacion'] = $a['observacion'];
                        $d['tiemporeal'] = $a['tiemporeal'];
                        $d['costo'] = $a['tiemporeal'] * $d['precio'];
                    }
                }
            }

            /* $sqlMat = "select cs.* from mod_logtaller.conf_norma cs where cs.idactividad = {$d['idactividad']}";
             $materiales = $conn->execute($sqlMat)
                 ->fetchAll(PDO::FETCH_ASSOC);*/

        }

        $datos = array('actividades' => $actividades, 'materiales' => $materiales);

        return $datos;

    }

    private function usarTodas($idservicio, $iddocumento, $idtipoprecio, $tiemporeal, $listActividades)
    {
        $conn = Doctrine_Manager:: connection();
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
            foreach ($datos as $d) {
                if ($d == 1) {
                    return true;
                    $this->getActividadesServicio($idservicio, $idtipoprecio, $tiemporeal, $listActividades);

                }
                return false;
            }

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

    private function auxAdicionarCita($datosDoc, $doc, &$objCita, $datosMedio, $listActividades, $listPiezasDisp)
    {

        $citasAddArray = new Doctrine_Collection('DatCita');
        $objCita->dinamicos = $datosMedio;
        $fechaactual = date("d/m/Y");
        $objCita->idcita = $doc->iddocumento;
        $objCita->fechadocumento = $fechaactual;
        $objCita->fechadocumento = $fechaactual;
        $objCita->idtipoprecioactividad = $listActividades['idtipoprecioactividad'];
        $objCita->idtipopreciopiezas = $listPiezasDisp['idtipopreciopiezas'];
        $objCita->iddocumentoorigen = null;
        $objCita->documentoorigen = 0;
        $citasAddArray[] = $objCita;
//        substr($datosDoc['idservicio'], 1, strlen($datosDoc['idservicio']) - 2);
        if (is_array($datosDoc)) {
            $objCita->synchronizeWithArray($datosDoc);
        }
        //print_r($citasAddArray->toArray());die;
        if ($citasAddArray->count()) {
            $citasAddArray->save();
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

    private function AdicionarServicioCita($idcita, $datosDoc)
    {


        //$servicios = ($datosDoc['idservicio']) ? $datosDoc['idservicio'] : null;
        //$separar = substr($datosDoc['idservicio'], 1, strlen($datosDoc['idservicio']) - 2);


            $servicios = explode(',', $datosDoc['idservicio']);



        foreach ($servicios as $servi) {
            $idservicio = $servi;
            //$idcita = $datosDoc['idcita'];
            $sql = "INSERT INTO mod_logtaller.dat_serviciocita(idservicio,idcita)
                    VALUES ($idservicio,$idcita)";
            $this->doctrineHelper->getConnection()->fetchArray($sql);
        }

    }

    private function verificarExistencianAtribIdentificador($datosDoc)
    {
        if ($datosDoc['atributoidentificador']) {
            $param['estado'] = array(1, 2);
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


    /**
     * @method gestiona las operaciones con las actividades y los las piezas disponibles de la cita.
     * @param       $idcita
     * @param array $listActividades
     * @param array $listPiezasDisp
     *
     * @throws Doctrine_Query_Exception
     * @throws Exception
     */
    private function gestionarActividadesYListPiezas($datosDoc, $listActividades = array(), $listPiezasDisp = array())
    {

        if ($listActividades['ActividadesElim'] || $listPiezasDisp['PiezasElim']) {
            foreach ($listActividades['ActividadesElim'] as $listActividadeelim) {
                Doctrine_Query::create()->delete('DatActividadCita')->whereIn(
                    'idindicador ', $listActividadeelim
                )->execute();
            }
            foreach ($listPiezasDisp['PiezasElim'] as $piezaselim) {

                Doctrine_Query::create()->delete('DatPiezadispCita')->whereIn(
                    'idindicador ', $piezaselim
                )->execute();
                Doctrine_Query::create()->delete('DatDocumentocl')->whereIN(
                    'idindicador ', $piezaselim
                )->andWhere('iddocumento = ?', $datosDoc['idcita'])->execute();
            }
        } else {

            if ($listActividades['ActividadesAdd']) {
                $cantAct = $this->adicionarActividades($listActividades['ActividadesAdd'], $datosDoc, $listActividades['idtipoprecioactividad']);
            }
            if ($listPiezasDisp['PiezasAdd']) {
                $this->adicionarPiezasDisp($listPiezasDisp, $datosDoc, $listPiezasDisp['idtipopreciopiezas']);
            }
        }
        return $cantAct;


    }

    private function adicionarPiezasDisp($listPiezasDisp, $datosDoc, $idtipopreciopiezas)
    {
        $facServi = new FacturacionService();
        $monedas = LogisticaGlobal::__init()->getMonedaEntidad();
        if ($datosDoc['idcita']) {
            $citaAux = Doctrine::getTable('DatCita')->find($datosDoc['idcita']);
        }
        $piezasAddArray = new Doctrine_Collection('DatPiezadispCita');
        if ($listPiezasDisp['PiezasAdd']) {
            $tiemporeserva = ($listPiezasDisp['reservarpiezas']) ? $listPiezasDisp['reservarpiezas'] : null;

            foreach ($listPiezasDisp['PiezasAdd'] as &$mater) {
                /*if ($mater['idpiezadispcita']) {
                    $objPiezasDisp = Doctrine::getTable('DatPiezadispCita')->find($mater['idpiezadispcita']);
                    $mater['idproducto'] = ($mater['idproducto'] == "") ? null : $mater['idproducto'];
                } else {*/
                    $objPiezasDisp = new DatPiezadispCita();
                    if ($mater['idpiezadispcita']) {
                        $objPiezasDisp->assignIdentifier($mater['idpiezadispcita']);
                    } else {
                        $mater['idcita'] = $datosDoc['idcita'];
                    }
                    $mater['dias'] = $tiemporeserva;

                    $reddisp=round($mater['disponible'], 2);
                    $redext=round($mater['existencia'], 2);
                    $redcant=round($mater['cantidad'], 2);
                    $mater['cantidad'] = ($mater['cantidad'] == "") ? 0 : $redcant;
                    $mater['disponible'] = ($mater['disponible'] == "") ? 0 : $reddisp;
                    $mater['existencia'] = ($mater['existencia'] == "") ? 0 : $redext;
                    $mater['idproducto'] = ($mater['idproducto'] == "") ? null : $mater['idproducto'];
                    $mater['denominacion'] = ($mater['denominacion'] == "") ? null : $mater['denominacion'];
                /*}*/


                //Si esta aperturado facturacion y por recurso se agrega que se integra con facturacion
                if ($this->_aperturaFAC/* && Zend_Json::decode($param['integrarFac'])*/) {
                    $parametro = null;

                    $parametro->idindicador = $mater['idindicador'];
                    $parametro->idtipoprecio = $idtipopreciopiezas;
                    $parametro->idcliente = ($datosDoc['idcita']) ? $citaAux->idcliente : $datosDoc['idcliente'];
                    $precio = $facServi->getPrecioVentaIndicador($parametro);

                    $monedaContab = (is_numeric($precio)) ? $precio : (isset($precio['datos']) ? $precio['datos'][$monedas->idmoneda] : 0);
                    //$monedaAlter = $precio['datos'][$monedas->idmonedaalternativa];
                    //$redprecv=round($mater['precioventa'], 2);

                    //$redprec=round($mater['precio'], 2);
                    $mater['precioventa'] = ($monedaContab) ? $monedaContab : 0;
                    //$mater['precioventa'] = ($mater['precioventa'] == 0 && $mater['precio'] == "") ? 0 : $redprec;

                    $mater['importe'] = ($monedaContab) ? $monedaContab * $mater['cantidad'] : 0;
                    $redimp=round($mater['importe'], 2);
                    $mater['importe']=$redimp;
                    /*$mater['precioventaalternativo'] = ($monedaAlter) ? $precio['datos'][$monedas->idmoneda]['precioventa'] : 0;
                    $mater['importealternativo'] = ($monedaAlter) ? $monedaAlter['precioventa'] * $mater['cantidad'] : 0;*/
                    //$mater['datosmoneda'] = Zend_Json::encode($precio['datos']);


                }

                if (is_array($mater)) {
                    $objPiezasDisp->synchronizeWithArray($mater);
                }
                $piezasAddArray[] = $objPiezasDisp;

                if(!empty($mater['idindicador'])) {
                    $this->eliminarCapacidadLiquidaCita($datosDoc['idcita'], $mater['idindicador']);
                    $docCapacidadLiquida = new DatDocumentocl();
                    if ($mater['capacidadliquida']) {
                        $docCapacidadLiquida['iddocumento'] = $datosDoc['idcita'];
                        $docCapacidadLiquida['idproducto'] = $mater['idproducto'] ? $mater['idproducto'] : null;
                        $docCapacidadLiquida['idindicador'] = $mater['idindicador'] ? $mater['idindicador'] : null;
                        $docCapacidadLiquida->save();
                    }
                }
            }

            if ($piezasAddArray->count()) {
                $piezasAddArray->save();
            }
        }
        return array();
    }


    private function adicionarActividades($activAdicionadas, $datosDoc, $idtipoprecioactividad)
    {
        if ($datosDoc['idcita']) {
            $citaAux = Doctrine::getTable('DatCita')->find($datosDoc['idcita']);
        }
        $actividadesAddArray = new Doctrine_Collection('DatActividadCita');

        if ($activAdicionadas) {

            foreach ($activAdicionadas as &$actv) {

                /* $this->objectHelper->unsetNullValues($actv);*/
                $objActividad = new DatActividadCita();
                $actv['idcita'] = $datosDoc['idcita'];
                $monedas = LogisticaGlobal::__init()->getMonedaEntidad();
                $actv['duracion'] = 1;
                $actv["codigoproveedor"] = ($actv["codigoproveedor"] == "") ? null : $actv["codigoproveedor"];
                $actv["umedida"] = ($actv["umedida"] == "") ? null : $actv["umedida"];
                //Si esta aperturado facturacion y por recurso se agrega que se integra con facturacion
                if ($this->_aperturaFAC/* && Zend_Json::decode($param['integrarFac'])*/) {
                    $facServi = new FacturacionService();
                    $parametro = null;
                    $parametro->idindicador = $actv['idindicador'];
                    $parametro->idtipoprecio = $idtipoprecioactividad;
                    $parametro->idcliente = ($datosDoc['idcita']) ? $citaAux->idcliente : $datosDoc['idcliente'];
                    $parametro->costo = 1;
                    $parametro->servicio = 1;
                    $precio = $facServi->getPrecioVentaIndicador($parametro);
                    $monedaContab = $precio['datos'][$monedas->idmoneda];
                    $monedaAlter = $precio['datos'][$monedas->idmonedaalternativa];
                    $actv['precioventa'] = ($monedaContab) ? $precio['datos'][$monedas->idmoneda]['precioventa'] : 0;
                    $actv['importe'] = ($monedaContab) ? $monedaContab['precioventa'] * $actv['duracion'] : 0;
                    $actv['precioventaalternativo'] = ($monedaAlter) ? $precio['datos'][$monedas->idmoneda]['precioventa'] : 0;
                    $actv['importealternativo'] = ($monedaAlter) ? $monedaAlter['precioventa'] * $actv['duracion'] : 0;
                    $actv['datosmoneda'] = Zend_Json::encode($precio['datos']);


                }

                if (is_array($actv)) {
                    $objActividad->synchronizeWithArray($actv);
                }
                $actividadesAddArray[] = $objActividad;

            }

            if ($actividadesAddArray->count()) {
                $actividadesAddArray->save();
            }
        }
        return ($datosDoc['idcita']) ? count($citaAux) : $actividadesAddArray->count();

    }


    public function devolverDatosMedio($idcita)
    {

        $query = Doctrine_Query::create();
        $query->select(', c.dinamicos, c.idindicador,c.idpadreindicador ')->from(
            'DatCita c'
        )->leftJoin('c.NomIndicador ind')->addSelect('ind.denominacion as denominacion')->where(
            'idcita = ?', array($idcita)
        );

        $resultado = $query->fetchArray();
        if (count($resultado) > 0) {
            return $resultado[0];
        } else {
            return null;
        }
    }

    public function eliminarOrden($idcita)
    {

        Doctrine_Query::create()->delete('DatDocumentocl')->whereIn('iddocumento ', $idcita)->execute();
        Doctrine_Query::create()->delete('DatActividadCita')->whereIn('idcita ', $idcita)->execute();
        Doctrine_Query::create()->delete('DatPiezadispCita')->whereIn('idcita ', $idcita)->execute();
        Doctrine_Query::create()->delete('DatServicioCita')->whereIn('idcita ', $idcita)->execute();
        Doctrine_Query::create()->delete('DatCita')->whereIn('idcita ', $idcita)->execute();

        /*if (class_exists('DatPedido')) {
            Doctrine_Query::create()->delete('DatPedidoOrdenTrabajo')->whereIn('idordentrabajo ', $idOrdenTrabajo)
                ->execute();
        }*/
        foreach ($idcita as $idDocumento) {
            if ($this->_aperturaAFT) {
                $doc = Doctrine::getTable('DatCita')->find($idDocumento);
                if ($doc->documentoorigen == 6) {
                    $this->_docAFTServices->eliminarDocEnvRepAutomatico($doc->iddocumentoorigen);
                }
            }
            $respuesta = parent::eliminarDocumento($idDocumento);
            if ($this->_aperturaFAC) {
                $servFac = new FacturacionService();
                $servFac->delCategoriaIndExt($idDocumento);
            }
        }
        return $respuesta;
    }

    public function confirmarOrden($idOrdenTrabajo)
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
        return $conn->execute("
            UPDATE mod_logistica.dat_documento
            SET estado= 1      
            WHERE iddocumento = {$idOrdenTrabajo}");

    }

    public function validarExistenciaDocGenerado($iddocumento, $ignorar = false)
    {
        if ($ignorar) {
            return true;
        } else
            return Doctrine_Query::create()->select()->from('DatDocumentoPadre dp')->whereIn('dp.idpadre', $iddocumento)
                    ->count() == 0;
    }

    public function aprobarCita($correocliente, $idcita)
    {

        $cita = Doctrine_Query::create()->select('dc.fechacita as fecha,dc.horaentrada as hora')->from('DatCita dc')->where(
            'dc.idcita = ?', array($idcita)
        )->fetchArray();


        $titulo = 'Gestionar Cita';
        $mensaje = "Se le notifica que la fecha de la cita es: " . $cita[0]['fecha'] . ",a las " . $cita[0]['hora'];
        $para = $correocliente[0];

        //$para = 'myhon@xetid.cu';
        $cabeceras = 'From: Administrador';

        $enviado = mail((string)$para, $titulo, $mensaje, $cabeceras);

        if (true)
           return array('idcita' => $idcita, 'cronologia' => parent::aprobarDocumento($idcita, true), 'msg' => 'Email enviado correctamente');
        // else
        //   echo 'Error en el envío del email';
        else
           return array('success' => false);

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
    public function cargarPersonas($idEntidad, $params = array())
    {
        $params['idspersonas'] = ($params['idspersonas']) ? $params['idspersonas'] : array();
        $params['criterio'] = ($params['criterio']) ? $params['criterio'] : null;
        $params['start'] = ($params['start']) ? $params['start'] : 0;
        $params['limit'] = ($params['limit']) ? $params['limit'] : 30;
        if (!$idEntidad) {
            $idEntidad = $this->global->Estructura->idestructura;
        }
        $personas = $this->_serviciosRecursosHumanos->getPrincipalesDatosPersona(
            $params['idspersonas'], $params['criterio'], $params['limit'], $params['start'], array(), array(),
            $idEntidad
        );
        return array("datos" => ($personas->data) ? $personas->data : array(), "cantidad" => $personas->quantity);
    }

    /**
     * @method devuelve las personas del área interna
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
            return $personas->data;
        } else {
            return $this->cargarPersonas($this->idestructuracomun, $params)['datos'];
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

        $conn = Zend_Registry::get('conexion');
        $selec = "Select distinct ca.idactividad, ca.idindicador, ca.idpadre, ca.idarbol, ca.codigo,ca.usatodasnormas,
         (case when ca.idindicador is not null then i.denominacion else ca.denominacion end) as denominacion";
        $from = " FROM  mod_logtaller.conf_actividad ca
                left join mod_datosmaestros.nom_indicador i on i.idindicador = ca.idindicador
                left join mod_logtaller.dat_actividadentidad dae on ca.idactividad = dae.idactividad";
        $where = " WHERE dae.identidad = {$this->global->Estructura->idestructura} ";

        //Excluiye los que ya estan adicionado en la orden
        /*if ($param['idordentrabajo']) {
            $where .= "  AND ca.idactividad  not in (Select ota.idactividad 
                  FROM mod_logtaller.dat_ordenactividad ota  WHERE  ota.idordentrabajo = {$param['idordentrabajo']} ) ";
        }*/

        if ($param['idactividad']) {
            $where .= "  AND ca.idactividad = {$param['idactividad']} ";
        }

        if ($param['nivel'] == 4) {

            if ($param['todo']) {
                $where .= "  AND ca.idpadre is not null ";
            } else {

                if ($param['idservicio'] && is_array($param['idservicio'])) {
                    $separar=implode(",", $param['idservicio']);
                    $where .= "  AND ca.idpadre in ({$separar})";
                }else if($param['idservicio']){

                    $where .= "  AND ca.idpadre in ({$param['idservicio']})";
                }


            }
        } else {
            //las actividades del primer nivel no tienen indicador
            $where .= "  AND ca.idindicador is null ";
        }

        if ($param['excluir'] && is_array($param['excluir'])) {
            $excluir = implode(",", $param['excluir']);

            $where .= "  AND ca.idindicador not in ($excluir) ";
        }
        //Filtro de la busqueda basica
        if ($param['criterio']) {
            /*if (is_numeric($param['criterio'])) {
                $where .= " and ca.codigo ilike '%{$param['criterio']}%' ";
            } else {
                $where .= " and ca.denominacion ilike '%{$param['criterio']}%' ";
            }*/
            $where .= " and ca.denominacion ilike '%{$param['criterio']}%' or ca.codigo ilike '%{$param['criterio']}%' ";
            /*);*/
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

        $result = $conn->execute($selec . $from . $where . $limit)->fetchAll();

        $monedas = LogisticaGlobal::__init()->getMonedaEntidad();
        //Si esta aperturado facturacion y por recurso se agrega que se integra con facturacion
        if ($this->_aperturaFAC && Zend_Json::decode($param['integrarFac'])) {

            /*if ($param['iddocumento']) {
                $citaAux = Doctrine::getTable('DatCita')->find($param['iddocumento']);
            }*/

            $facServi = new FacturacionService();
            foreach ($result as $index => $prod) {
                $parametro = null;
                $parametro->idindicador = $prod['idindicador'];
                $parametro->idtipoprecio = $param['idtipoprecio'];
                //$parametro->idcliente = ($param['iddocumento']) ? $citaAux->idcliente : $param['idcliente'];
                $parametro->idcliente = $param['idcliente'];
                $parametro->costo = 1;
                $parametro->servicio = 1;

                $precio = $facServi->getPrecioVentaIndicador($parametro);
                $monedaContab = $precio['datos'][$monedas->idmoneda];
                $monedaAlter = $precio['datos'][$monedas->idmonedaalternativa];
                $result[$index]['costo'] = ($monedaContab) ? $monedaContab['precioventa'] : 0;
                $result[$index]['importealternativo'] = ($monedaAlter) ? $monedaAlter['precioventa'] : 0;
                $result[$index]['datosmoneda'] = Zend_Json::encode($precio['datos']);
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


    private function getSqlDatosOrden($idOrdenTrabajo)
    {
        return "select
            m.idproducto, sum( m.cantidad) as entregado, sum(round(m.cantidad*m.preciocontable,2)) as importecup,
            sum(round(m.cantidad*m.precioalternativo,2)) as importecuc,
            coalesce((
                select sum(m2.cantidad)
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
            ),0) as devuelto,
            (
                select string_agg('VE-' || dg.nrodoc,', ') from mod_logistica.dat_documento dg 
                inner join mod_logistica.dat_movimiento dgm on dgm.iddocumento = dg.iddocumento
                inner join mod_logistica.dat_documentopadre dgp on dgp.iddocumento = dg.iddocumento
                where dgm.idproducto = m.idproducto and dgp.idpadre = {$idOrdenTrabajo} and dg.estado = 4
            ) as numerosvales,
            (
                select string_agg('VD-' || dg.nrodoc,', ') from mod_logistica.dat_documento dg 
                inner join mod_logistica.dat_movimiento dgm on dgm.iddocumento = dg.iddocumento
                inner join mod_logistica.dat_documentopadre dgp on dgp.iddocumento = dg.iddocumento
                inner join mod_logistica.dat_documentopadre dgpp on dgpp.iddocumento = dgp.idpadre 
                where dgm.idproducto = m.idproducto and dgpp.idpadre = {$idOrdenTrabajo} and dg.estado = 4
            ) as numerosvalesdev,
            coalesce((
                select sum(round(m2.cantidad*m2.preciocontable,2))
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
            ),0) as devueltocuc
            , dmat.idmaterial
            from mod_logistica.dat_movimiento m
            inner join mod_logistica.dat_documento d on d.iddocumento = m.iddocumento
            left join mod_logtaller.dat_material dmat on dmat.idordentrabajo = {$idOrdenTrabajo} and dmat.idproducto = m.idproducto            
            where m.iddocumento in (
                select iddocumento 
                from mod_logistica.dat_documentopadre where idpadre = {$idOrdenTrabajo}
            )
            and d.estado = 4
            group by m.idproducto,dmat.idmaterial";
    }

    private function updateDatosMateriasles($idOrdenTrabajo)
    {
        $sql = "update mod_logtaller.dat_material d
                set cantidadreal = q.entregado - q.devuelto,
                    importecup = q.importecup - q.devueltocup,
                    importecuc = q.importecuc - q.devueltocuc,
                    nrosvales = q.numerosvales ||' '|| coalesce(q.numerosvalesdev,'')
                from (
                {$this->getSqlDatosOrden($idOrdenTrabajo)}
                )q
                where d.idmaterial = q.idmaterial";
        LogisticaDoctrineHelper::__init()->getConnection()->execute($sql);
    }

    private function completeData($queryResult, $idOrdenTrabajo)
    {
        $total = LogisticaDoctrineHelper::__init()->getConnection()->execute($this->getSqlDatosOrden($idOrdenTrabajo))
            ->fetchAll(PDO::FETCH_ASSOC);
        foreach ($queryResult as $pos => $material) {
            foreach ($total as $item) {
                if ($item['idmaterial'] == $material['idmaterial']) {
                    $queryResult[$pos]['cantidadreal'] = $item['entregado'] - $item['devuelto'];
                    $queryResult[$pos]['importecup'] = $item['importecup'] - $item['devueltocup'];
                    $queryResult[$pos]['importecuc'] = $item['importecuc'] - $item['devueltocuc'];
                    $queryResult[$pos]['nrosvales'] = $item['numerosvales'] . '  ' . $item['numerosvalesdev'];
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
        $sql = "select DISTINCT  p.idindicador, i.denominacion, i.codigo, p.idumedida as idunidadmedida ,
               1 as cantplanif, p.precio as precioventa, p.precioalternativo as precioalternativo,
               um.abreviaturaunidadmedida as denominacionunidadmedida, i.numeropieza as codigoproveedor,
               (p.cantidad - (select coalesce(sum(cantidad),0) from mod_logistica.dat_cantidadcomprometida 
                                                 where estado = 1 and idproducto = p.idproducto)) as disponible,
               op.denominacion as deposito, p.idestructura as iddeposito, p.idproducto
               from mod_logistica.dat_producto p
               INNER JOIN mod_datosmaestros.nom_indicador i on p.idindicador = i.idindicador
               LEFT JOIN mod_datosmaestros.nom_unidadmedida um on i.idumedida = um.idunidadmedida
               left join mod_estructuracomp.dat_estructuraop op on op.idestructuraop = p.idestructura    
			   where p.idestructuracomun = {$this->idestructuracomun}
              ";

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
        if ($parametros['excluir']) {//los ids separados por coma (###,###)
            $excluir = explode(",", $parametros['excluir']);
            foreach ($excluir as $prod) {
                if (is_numeric($prod))
                    $arrExcluir[] = $prod;
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
        $monedas = LogisticaGlobal::__init()->getMonedaEntidad();
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
        }
        return array('datos' => $result, 'cantidad' => $cantidadTotal);
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
            $sql = "select p.idestructura,p.idindicador,sum(p.cantidad - (select coalesce(sum(cantidad),0) 
                                                 from mod_logistica.dat_cantidadcomprometida 
                                                 where estado = 1 and idproducto = p.idproducto)) as disponibilidad
                from mod_logistica.dat_producto p
                where p.idestructuracomun = {$this->idestructuracomun} and p.idindicador = $idindicador
                and p.cronologia > 0
                group by p.idindicador, p.idestructura";
            $instancia = $conn->fetchAll($sql);
            if (count($instancia) > 0) {
                $total[] = $instancia[0];
                $existe = 1;
            } else {
                $existe = 0;
            }
        }

        return $existe;
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
            throw new Exception("Debe configurar la subordinación para las áreas del taller de la entidad actual");
        }
        return $areasTall;
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
                    //$parametros['identidad'] = $this->global->Estructura->idestructura;
                    $dqlRNA = $this->_utilesServices->getMediosDisponibles($parametros, true);
                    if ($parametros['denomidmedio']) {
                        $whereIdentificador = $this->_utilesServices->getIdentificadorDat($parametros);
                        $dqlRNA->addWhere($whereIdentificador);
                    }
                    $dqlRNA->andWhere(" drna.idestadoperacion IN (1,2,3,4)");
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


        $query->select(
            'cpm.idplanificacionmantenimiento, cpm.periodo, cpm.recursoconsumido, cpm.idindicador, dp.idproducto ,
            ind.denominacion as denominacion, nmar.denominacion as marca, nm.denominacion as modelo, drn.nroserie as nroserie, drn.idregnumerico , 
            drna.nroinventario as nroinventario,drna.cantidadrecursoconsumido,drna.fechaexpini,dm.idindicador, dm.dinamicos as dinamicos, ind.idnaturaleza,
            ');

        return array('cantidad' => $query->count(), 'datos' => $query->fetchArray());
    }


    public function getQueryBasicoOrdenTrabajo($params)
    {
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
            $datos = ($parametros['datos']) ? $parametros['datos'] :
                $this->_utilesServices->getEnviadosAReparar($parametros);
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
            'modelo' => 'NomDestino', 'idnom' => 'iddestino', 'start' => $params['start'], 'limit' => $params['limit']
        );
        return $nomenclTallServis->cargarNomenclador($obj, false);
    }

    public function generarPedido($params)
    {
        $productos = array();
        if ($params['allProducto']) {
            $datPiezaDipsCita = $this->cargarPiezasDisp($params);
            foreach ($datPiezaDipsCita['datos'] as $pieza) {
                array_push($productos, array(
                    'idindicador'=> $pieza['idindicador'],
                    'cantidad'=>$pieza['cantidad'],
                    'capacidadliquida'=>$pieza['capacidadliquida'])
                );
            }
        }
        $pedidoServices = new PedidoService();
        $datosPedido = $pedidoServices->adicionarPedido($params['idcliente'], ($params['allProducto']) ? $productos : Zend_Json::decode($params['productos']), null, $params['idcita']);
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

    /*  public function cargarSolicitudesAprobadas($params)
      {
          $params['excluir'] = $this->idDocumentoOrigenConOrdenAbierta(1);
          return $this->_solicitudServices->getSolicitudesAprobadas($params);
      }*/

    /*public function cargarSolicitudesATercerosAprobadas($params)
    {
        $params['excluir'] = $this->idDocumentoOrigenConOrdenAbierta(3);
        return $this->_solicitudServices->getSolicitudTerceros($params);
    }*/

    private function idDocumentoOrigenConOrdenAbierta($docOrigen)
    {
        $params = array();
        $params['idestructura'] = $this->idestructuracomun;
        $params['estado'] = array(EstadoDocumentoModel::ESTADO_PENDIENTE, EstadoDocumentoModel::ESTADO_ELABORACION);
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

    public function cargarTiposDePrecioPiezas($params)
    {
        if ($this->_aperturaFAC) {
            $params['cargarSinEntidad'] = 1;
            $facService = new FacturacionService();
            $params['idsubsistema'] = LogisticaGlobal::SUBSISTEMA_TALLERES;
            return $facService->getTipoPreciosCliente($params);
        }
    }

    public function cargarTiposDePrecioActividades($params)
    {

        if ($this->_aperturaFAC) {
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
                    ->findByDql("idindicador = {$mat['idindicador']} and idordentrabajo = {$idOrden}");
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
                            if ($index == 0)
                                $objMatArr['nrosvales'] .= $num;
                            else
                                $objMatArr['nrosvales'] .= "," . $num;
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
    public function cancelarDocumentoTalleres($iddocumento)
    {
        if ($this->checkPuedeCancelar($iddocumento, $parametros = array())) {
            $this->anularDocumentoTalleres($iddocumento);
            return true;
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
            return true;
        }
        return false;
    }

    public function getDepositosEntidad($parametros)
    {
        $parametros['identidad'] = $this->global->Estructura->idestructura;
        $idsDeposit = $this->seguridadHelper->obtenerEstructurasNoFormales($this->global->Perfil->certificado, 8);
        $depositos = $this->estructuraHelper->obtenerEstructurasNoFormales(
            false, $parametros['identidad'], false, null, null, $idsDeposit, -1
        );
        $datosDepositos = array();
        foreach ($depositos as $i => $r) {
            $datosDepositos[] = $r['DatEstructuraop'][0]['idestructuraop'];
        }
        return $datosDepositos;
    }

    public function anularDocumentoTalleres($iddocumento)
    {
        //if($this->contabilidadHelper->verificarDuoContabilizadoExterno($iddocumento) == false){
        $this->trazaDocumento->guardarTraza('Documento anulado', $iddocumento, EstadoDocumentoModel::ESTADO_ANULADO);
        return $this->estadoModel->setEstadoDocumento($iddocumento, EstadoDocumentoModel::ESTADO_ANULADO);
        //}else{
        //	throw new ZendExt_Exception('LOG_LB_DOC_028');
        //}
    }

    /*Metodos que se cargan en la Cita*/
    public function cargarPiezasDisp($params)
    {
        $objIddocPedido = $this->documentosHelper->devuelveIddocByIdEstructura(
            'pedido', $this->idestructuracomun, LogisticaGlobal::SUBSISTEMA_DIST
        );
        if ($params['idcita']) {
            $query = Doctrine_Query::create();

            $asExt = "dpd1";

            if ($params['ordentrabajo']) {
                $query->select("$asExt.dias,$asExt.idcita,$asExt.cantidad,$asExt.idindicador,$asExt.disponible as disponible,
                $asExt.precioventa as precio,$asExt.importe as importecup,$asExt.precioventaalternativo as precioalternativo,$asExt.existencia as existencia, 
                  $asExt.importealternativo as importecuc,$asExt.idproducto as idproducto,$asExt.denominacion as denominacion, 
                  (CASE WHEN ddcl.iddocumentocl is not null THEN 1 ELSE 0 END) as capacidadliquida");
            } else {
                $query->select("$asExt.dias,$asExt.idcita,$asExt.cantidad,$asExt.idindicador,$asExt.disponible as disponible,
            $asExt.precioventa as precioventa,$asExt.importe as importe,$asExt.precioventaalternativo as precioventaalternativo,$asExt.existencia as existencia, 
             $asExt.importealternativo as importealternativo,$asExt.idproducto as idproducto, $asExt.denominacion as denominacion,
              (CASE WHEN ddcl.iddocumentocl is not null THEN 1 ELSE 0 END) as capacidadliquida");
            }
            $query->from("DatPiezadispCita $asExt")
                ->leftJoin("$asExt.DatCita dc")
                ->leftJoin("dc.DatDocumento dd")
                ->where('idcita =?', array($params['idcita']));

            $maestroProducto = new MaestroProductoModel();
            $maestroProducto->addQueryNomIndicador($query, $asExt, 'i', 'ih', $select = true, false, 1, true);

            $query->leftJoin("dd.DatDocumentoPadre ddp on ddp.idpadre = dd.iddocumento")
                    ->leftJoin("ddp.DatDocumento ddoc on ddoc.iddocumento = ddp.iddocumento and ddoc.iddoc = {$objIddocPedido->iddoc}")
                    ->leftJoin("dd.DatDocumentocl ddcl on ddcl.iddocumento = dd.iddocumento and ddcl.idindicador = $asExt.idindicador")
                    ->addSelect("coalesce(string_agg('DOC-' || ddoc.nrodoc,', '), string_agg('REF-' ||ddoc.numeroref,', ') ) as pedgenerado")
                    ->groupBy("$asExt.idpiezadispcita, i.idindicador, i.precio, ih.precio, ih.tipocontrol, ddcl.iddocumentocl,
                    ih.explotacion, ih.almacenado, ih.idmarca, ih.isuh, ih.idgruposubgrupo, ih.idmodelo, ih.peso, ih.largo, ih.ancho, ih.alto, 
                    ih.codigoauxiliar, ih.descripcionventa, umedida.abreviaturaunidadmedida, umedida.decimales, ddoc.nrodoc, ddoc.numeroref, ih.codigobarra");

            if ($params['start']) {
                $query->offset($params['start']);
            }
            if ($params['limit']) {
                $query->limit($params['limit']);
            }
            if ($params['criterio']) {
                $query->andWhere(
                    "($asExt.denominacion ilike '%{$params['criterio']}%')"

                );
            }
        }
        $datos = $query->fetchArray();

        $cantidad = $query->count();
        //$resul = $query->fetchArray();

       /* $idsIndicadores = array();
        foreach ($resul as $r) {
            $idsIndicadores[] = $r['idindicador'];
        }
        $disponible = $this->comprobarExistenciaMaterial($idsIndicadores);*/

       // $datos = array();
       /* foreach ($resul as &$re) {
            $re['disponible'] = $disponible;
            $datos[] = $re;
            $sqlDisp = "UPDATE mod_logtaller.dat_piezadispcita
                    SET disponible = ($disponible)

                    ";
            $this->doctrineHelper->getConnection()->fetchArray($sqlDisp);
        }*/

        return array(
            'datos' => $datos,
            'cantidad' => $cantidad

        );


    }

    /**
     * Duplica el documento seleccionado.
     * @param numeric $iddocumento Indentificador del documento.
     * @return Integer
     */
    public function copiarDocumento($iddocumento, $sameDoc = false, $cancelSigno = false)
    {
        $idCopia = $this->copiarDocumentoCitas($iddocumento, $sameDoc, $cancelSigno);
        $docCita = Doctrine::getTable('DatCita')->find($iddocumento);
        $cita = $docCita->copy();
        $datos = $docCita->toArray();
        $datos['idcita'] = $idCopia;
        $datos['iddocumento'] = $idCopia;
        $cita->synchronizeWithArray($datos);
        $cita->save();
//Servicio cita
        $datServiciocita = $this->devolverDatServicioCita($iddocumento);
        foreach ($datServiciocita as $dsc) {
            $idcita = $dsc['idcita'] = $idCopia;
            $idservicio = $dsc['idservicio'];
            $sql = "INSERT INTO mod_logtaller.dat_serviciocita(idservicio,idcita)
                    VALUES ($idservicio,$idcita)";
            $this->doctrineHelper->getConnection()->fetchArray($sql);
        }
//Actividades Citas
        $datActividadCita = $this->devolverDatActividadCita($iddocumento);

        foreach ($datActividadCita as $dac) {

            $idactividadcita = $dac['idactividadcita'];
            unset($idactividadcita);
            $denominacionact = $dac['denominacion'];
            $codigoact = $dac['codigo'];
            $sql1 = "SELECT um.abreviaturaunidadmedida as umedidaact from mod_logtaller.dat_actividadcita ac 
                    left join mod_logtaller.dat_cita dac on dac.idcita = ac.idcita left join mod_datosmaestros.nom_indicador ni
                    on ni.idindicador = dac.idindicador left join mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = ni.idumedida
                    where dac.idcita= {$iddocumento} and ac.idactividadcita = {$dac['idactividadcita']} ";
            $umedidaact = $this->doctrineHelper->getConnection()->fetchOne($sql1);
            $duracion = $dac['duracion'];
            $idindicador = $dac['idindicador'];
            $precioventa = $dac['precioventa'];
            $importe = $dac['importe'];
            $idcita = $dac['idcita'] = $idCopia;

            $sql = "INSERT INTO mod_logtaller.dat_actividadcita(denominacion,codigo,duracion,idindicador,precioventa,importe,idcita)
                    VALUES ('$denominacionact','$codigoact',$duracion,$idindicador,$precioventa,$importe,$idcita)";
            $this->doctrineHelper->getConnection()->fetchArray($sql);
        }
        /*   $datActividadCita = Doctrine::getTable('DatActividadCita')->findByDql('idcita = ?', array($iddocumento))
        ->getFirst();
    if ($datActividadCita) {
        $newactividad = $datActividadCita->copy();
        $datosAct = $datActividadCita->toArray();
        $datosAct['idcita'] = $idCopia;
        $newactividad->synchronizeWithArray($datosAct);
        $newactividad->save();
    }*/

//Piezas disp cita
        /* $datPiezaDipsCita = Doctrine::getTable('DatPiezadispCita')->findByDql('idcita = ?', array($iddocumento))
             ->getFirst();
         if ($datPiezaDipsCita) {
             $newpieza = $datPiezaDipsCita->copy();
             $datosPiez = $datPiezaDipsCita->toArray();
             $datosPiez['idcita'] = $idCopia;
             $newpieza->synchronizeWithArray($datosPiez);
             $newpieza->save();
         }*/

        $datPiezaDipsCita = $this->devolverDatPiezaDisp($iddocumento);
        foreach ($datPiezaDipsCita as $dpc) {

            $idpiezadispcita = $dpc['idpiezadispcita'];
            unset($idpiezadispcita);
            $idindicador = $dpc['idindicador'];
            $cantidad = ($dpc['cantidad']) ? $dpc['cantidad'] : 0;
            $disponible = $dpc['disponible'];
            $precioventa = $dpc['precioventa'];
            $importe = $dpc['importe'];
            $existencia = ($dpc['existencia']) ? $dpc['existencia'] : 0;
            $idproducto = $dpc['idproducto'] ? $dpc['idproducto'] : 0;
            $denominacion = $dpc['denominacion'];
            $dias = ($dpc['dias']) ? $dpc['dias'] : 0;
            $idcita = $dpc['idcita'] = $idCopia;
            $sql = "INSERT INTO mod_logtaller.dat_piezadispcita(denominacion,dias,idcita,cantidad,idindicador,disponible,precioventa,
                    importe,existencia,idproducto)
                    VALUES ('$denominacion',$dias,$idcita,$cantidad,$idindicador,$disponible,$precioventa,$importe,$existencia,$idproducto)";
            $this->doctrineHelper->getConnection()->fetchArray($sql);
        }


//Clientes de la cita
        $cliente = Doctrine::getTable('DatDocumentoCliente')->findByDql('iddocumento = ?', array($iddocumento))
            ->getFirst();
        if ($cliente) {
            $newcliente = $cliente->copy();
            $datosc = $cliente->toArray();
            $datosc['iddocumentocliente'] = null;
            $datosc['iddocumento'] = $idCopia;
            $newcliente->synchronizeWithArray($datosc);
            $newcliente->save();
        }
        /*  $padre = Doctrine::getTable('DatDocumentoPadre')->findByDql('iddocumento = ?', array($iddocumento))
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

    public function copiarDocumentoCitas($iddocumento, $sameDoc = false, $cancelSigno = false, $sameMov = true)
    {
        $this->trazaDocumento->guardarTraza('Documento duplicado', $iddocumento);
        $this->cargarEncabezado($iddocumento);
        $doc = Doctrine::getTable('DatDocumento')->find($iddocumento);
        $nuevoDoc = $doc->copy(false);
        if (!$sameDoc) {
            $datos = $doc->toArray();
            $this->inicializarDocumento($datos);
            $datos['aprobadopor'] = null;
            $datos['idcomprobante'] = null;
            $datos['nrodoc'] = $this->devolverUltimoNumeroDoc($nuevoDoc->iddoc, $nuevoDoc->idestructuracomun,
                $this->configuracionHelper
                    ->getEjercicioActualSubsistema($this->idestructuracomun, $this->idSubsistema));
            $nuevoDoc->synchronizeWithArray($datos);
            $nuevoDoc->observaciones = "Documento generado a partir del "
                . "documento No:{$doc->nrodoc} - Ref:{$doc->numeroref}";
        }
        $nuevoDoc->save();
        return $nuevoDoc->iddocumento;
    }

    public function devolverDatServicioCita($iddocumento)
    {
        $query = Doctrine_Query::create();
        return $query->select("*")
            ->from('DatServicioCita dsc')
            ->where('dsc.idcita = ?', $iddocumento)
            ->fetchArray();
    }

    public function devolverDatActividadCita($iddocumento)
    {
        $query = Doctrine_Query::create();
        return $query->select("*")
            ->from('DatActividadCita dac')
            ->where('dac.idcita = ?', $iddocumento)
            ->fetchArray();
    }

    public function devolverDatPiezaDisp($iddocumento)
    {
        $query = Doctrine_Query::create();
        return $query->select("*")
            ->from('DatPiezadispCita dpc')
            ->where('dpc.idcita = ?', $iddocumento)
            ->fetchArray();
    }

    public function enviarCorreo($datosDoc)
    {

        $query = Doctrine_Query::create();
        /*   return $query->select("*")
               ->from('DatCita dc')
               ->where('dc.idcita = ?', $datosDoc['idcita'])
               ->fetchArray();*/
        $idusuario = $this->idusuario;
        $titulo = 'Gestionar Cita';
        $mensaje = "Se le notifica que la fecha de la cita es:" . $datosDoc['fechacita'] . ", a las" . $datosDoc['horaentrada'];
        $para = $datosDoc['correo'];
        $cabeceras = 'From: Empresa SASA';
        $enviado = mail($para, $titulo, $mensaje, $cabeceras);

        /*if ($enviado)
            echo 'Email enviado correctamente';*/
        // else
        //   echo 'Error en el envío del email';
    }

}
