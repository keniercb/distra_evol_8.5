<?php

/**
 *
 */
class DocEnviadoRepararModel extends DocumentoActivoModel
{
    protected $_arrOperaciones, $idsubsistema;

    /**
     *
     */
    public function __construct($idsubsistema = LogisticaGlobal::SUBSISTEMA_AFT)
    {
        $this->idsubsistema = $idsubsistema;
        parent:: __construct($idsubsistema);
        $this->_arrOperaciones = array(
            'OPER_REPMENOR',
            'OPER_REPMEDIA',
            'OPER_REPGENERAL',
            'OPER_REPIMPREV',
            'OPER_MANTENIMIENTO',
            'OPER_REMODELACION'
        );
        $this->initRelations();
    }

    public function initRelations()
    {
        $relations = array();
        array_push(
            $relations,
            array(
                'cardinalidad' => 'many',
                'relation' => 'DatMovRegnumerico',
                'properties' => array('local' => 'idmovimiento', 'foreign' => 'idmovimiento')
            )
        );
        $this->doctrineHelper->tryInyectRelactions(new DatMovimientos, $relations);
    }

    /**
     *
     */
    public function addActivoDoc($parametros)
    {
		$cDatDocumentoActivo = 'DatDocumentoActivo';
        $cDatDocEnviadoReparar = 'DatDocEnviadoReparar';
        $doc = parent::addActivoDoc($parametros);
        if ($parametros['idclientesproveedores'] == null || $parametros['idclientesproveedores'] == '') {
            unset($parametros['idclientesproveedores']);
        }
        if ($parametros['identidaddestino'] == null || $parametros['identidaddestino'] == '') {
            unset($parametros['identidaddestino']);
        }
		if ($parametros['idtransportador'] == null || $parametros['idtransportador'] == '') {
            unset($parametros['idtransportador']);
        }

        $doc->$cDatDocumentoActivo->$cDatDocEnviadoReparar->synchronizeWithArray($parametros);

        $cDatDocumentoCliente = 'DatDocumentoCliente';
        $cDatDocumentoClienteObj = new DatDocumentoCliente();
        if ($parametros['iddocumento']) {
            $datDocCliente = Doctrine::getTable('DatDocumentoCliente')->findByDql('iddocumento = ?',
                array($parametros['iddocumento']));

            if (count($datDocCliente) > 0) {
                $datDocCliente[0]->idcliente = $parametros['idclientesproveedores'];
                $datDocCliente[0]->idcondicionpago = $parametros['idcondicionpago'];
                $datDocCliente[0]->tipocliente = 1;
                $datDocCliente->save();
            } else {
                $cDatDocumentoClienteObj->idcliente = $parametros['idclientesproveedores'];
                $cDatDocumentoClienteObj->idcondicionpago = $parametros['idcondicionpago'];
                $cDatDocumentoClienteObj->tipocliente = 1;
                $doc->$cDatDocumentoCliente->add($cDatDocumentoClienteObj);
            }
        } else {

            $cDatDocumentoClienteObj->idcliente = ($parametros['idclientesproveedores']) ?
                $parametros['idclientesproveedores'] : null;
            $cDatDocumentoClienteObj->idcondicionpago = ($parametros['idcondicionpago']) ?
                $parametros['idcondicionpago'] : null;
            $cDatDocumentoClienteObj->tipocliente = 1;
			
            $doc->$cDatDocumentoCliente->add($cDatDocumentoClienteObj);
        }

        $doc->save();

        return $doc;
    }

    /**
     *
     */
    public function getDatEspecificosDoc($idDocumento)
    {
        $oEnvReparar = Doctrine::getTable('DatDocEnviadoReparar')->find($idDocumento);

        $campoEntidad = new stdClass();

        $campoEntidad->xtype = "textarea";
        $campoEntidad->name = "Entidad";
        $campoEntidad->anchor = "95%";
        $campoEntidad->fieldLabel = "Entidad";
        $campoEntidad->data = $oEnvReparar->entidad;

        return array("data" => array($campoEntidad));
    }

    /**
     * Método que crea un documento con los registros numéricos enviados a reparar,
     */
    public function getEnviadosAReparar($parametros)
    {
        $sRegNumActivo = new RegNumActivoService();
        $arrIdesOperaciones = $this->_mComunAFT->getArrayIdOperacionesUtilizadas(
            false, false, $this->_arrOperaciones, false
        );
        if (count($arrIdesOperaciones)) {
            if ($parametros['idarearesp'] && is_array($parametros['idarearesp'])) {
                $arrIdsEstructuras = $parametros['idarearesp'];
            } else if (isset($parametros['idclienteestructura']) && is_numeric($parametros['idclienteestructura'])) {
                $arrIdsEstructuras = $this->_mComunAFT->getIdEstructurasHijas(
                    $parametros['idclienteestructura'], true
                );
            } else {
                $arrIdsEstructuras = $this->_mComunAFT->getIdEstructurasHijas(
                    ($parametros['idestructura']) ? $parametros['idestructura'] : $parametros['idarearesp'], true
                );
            }
            $subQuery = new Doctrine_Query();
            $subQuery->select('mr.idregnumerico as idregnumerico');

            $subQuery->from('DatDocumento d');
            $subQuery->innerJoin('d.DatDocumentoPadre dp');

            new DatMovimientos();
            //$subQuery->from('DatDocTransfereciaEntreAreas ta');
            $subQuery->innerJoin('d.DatMovimientos m');

            $mMovRegNum = new MovRegNumericoModel();
            $mMovRegNum->addJoinModelMy($subQuery, 'm', 'mr', 1);
            $subQuery->where('dp.idpadre = m.iddocumento');

            $resutSubQuery = $subQuery->fetchArray();
            $arrIdRegNumericos = array();

            foreach ($resutSubQuery as $value) {
                $arrIdRegNumericos = $value['idregnumerico'];
            }

            $subq = $sRegNumActivo->getQuerySelectIDregnumDoc($arrIdsEstructuras);
            foreach ($subq as $datSub) {
                $idreg[] = $datSub['idregnumerico'];
            }
            $query = $sRegNumActivo->getQueryDataVisualizarRegNumActivos($parametros);

            $mMovRegNum = new MovRegNumericoModel();
            $mMovRegNum->addJoinModelMy($query, 'rn', 'mvReg', 1);

            $query->innerJoin("mvReg.DatMovimientos mov");
            $query->innerJoin("mov.DatDocumento doc");
            $query->innerJoin("doc.DatDocumentoActivo doca");
            $query->innerJoin('doca.DatDocEnviadoReparar der');
            if (isset($parametros['ventana']) && $parametros['ventana'] == 'aft') {
                $query->addWhere("der.identidaddestino = ?", array($this->global->Estructura->idestructura));
                /*if (isset($parametros['idclienteestructura']) && is_numeric($parametros['idclienteestructura'])) {
                    $query->addWhere("der.identidaddestino = ?", array($parametros['idclienteestructura']));
                } else {
                    $query->addWhere("der.identidaddestino = -1");
                }*/
            }
            $query->addSelect("doc.iddocumento as iddocumento, doc.nrodoc as nrodoc");
            $query->addSelect("i.idpadre as idpadreind");
            $query->addSelect("nmarc.denominacion as marca");
            $query->addSelect("nmod.denominacion as modelo");
            new CfgIdentificadorMedio();
            $query->leftJoin("i.CfgIdentificadorMedio confident");
            $query->addSelect('confident.denominacion as denomconfmedio');
            $query->addSelect('confident.identificador as identificador');
            $query->addSelect('confident.ididentificadormedio as ididentificadormedio');

            $query->addWhere("drna.idestadoperacion = 5");

            if ($parametros['tipo'] && ($parametros['tipo'] == 0 || $parametros['tipo'] == 1)) {
                $query->addWhere("doca.tipo = {$parametros['tipo']}");
            } else {
                $query->addWhere("doca.tipo = 0");
            }
            $query->andWhereIn("doc.idoperacion", $arrIdesOperaciones);
            $query->andWhereIn("p.idestructura", $arrIdsEstructuras);

            $query->andWhereNotIn("mvReg.idregnumerico", $arrIdRegNumericos);
            if (count($idreg) > 0) {
                $query->andWhereNotIn('drna.idregnumerico', $idreg);
            }
            if ($parametros['idregnumerico']) {
                $query->addWhere("drna.idregnumerico = {$parametros['idregnumerico']}");
            }
            if ($parametros['excluir'] && count($parametros['excluir']) > 0) {
                $query->andWhereNotIn("drna.idregnumerico", $parametros['excluir']);
            }
            $regNumServiceAFT = new RegNumActivoService();
            $query = $regNumServiceAFT->getRegNumericoRecepcionWhere($parametros, $query);
            return array("datos" => $query->fetchArray(), "total" => $query->count(), "cantidad" => $query->count());
        } else {
            return array("error" => 4);
        }
    }

    /**
     * Método que crea un documento con el registro numérico enviado a reparar
     */
    public function addDocDeEnviadoReparar($parametros)
    {
        $cEstructura = 'Estructura';
        if($parametros['idregnumerico']){
            $docCreadoDesdeOT = true;
            $query = Doctrine_Query::create();
            $query->select("p.idestructura as idestructura,p.idestructuracomun as idestructuracomun");
            $query->from("DatProductoLogistica p");
            $query->innerJoin("p.DatRegnumerico rn");
            $query->innerJoin("rn.DatRegnumericoActivo drna");
            $query->where("rn.idregnumerico = {$parametros['idregnumerico']}");
            $resultSubQuery = $query->fetchArray();
            $parametros = array_merge_recursive($parametros,$resultSubQuery[0]);
            $idestructuracomun = $parametros['idestructuracomun'];
            $identidad = $parametros['idestructura'];
            $parametros['idestructuracomun'] = ($identidad)?$identidad:$idestructuracomun;
        }
        $idestructuracomun = ($idestructuracomun )?$idestructuracomun :ZendExt_GlobalConcept::getInstance()->$cEstructura->idestructura;
        $identidad = ($identidad )?$identidad :ZendExt_GlobalConcept::getInstance()->$cEstructura->idestructura;
        $sRegNumActivo = new RegNumActivoService();
        $sRegNumActivo->initReNumActivoModel();
        $sMovimiento = new MovimientoService();
        $oDatDocumento = new DatDocumentoActivo();
        $objRegNumAftModel = $sRegNumActivo->getObjRegNumActivoModel();
        $cDatDocumentoActivo = 'DatDocumentoActivo';

        $operaciones = $this->_mComunAFT->getDatosInterfazOperacion(
            false, false, 'OPER_REC_ENV_REPARAR', false, $idestructuracomun
        );

        if (count($operaciones) == 0) {
            throw new Exception('LOG_AFT_DOC_005');
        } else {
            $parametros['idoperacion'] = $operaciones[0]['idoperacion'];
            $sConfGeneral = ServiciosConfiguracionGeneralHelper::__init();
            $doc = $sConfGeneral->obtenerOperaciones($idestructuracomun, null, null, $parametros['idoperacion']);

//            $doc = $this->sConfGeneral->DocumentosPorOperacion($parametros['idoperacion']);
            $parametros['iddoc'] = $doc[0]['iddocentidad'];
            $valores = array();
            $ultimoNroDoc = new DocumentoActivoModel();
            $parametros['nrodoc'] = $ultimoNroDoc->devolverUltimoNumeroDoc($parametros['iddoc'], $identidad) + 1;
            $docService = new DocumentoActivoService();
            foreach ($parametros['datosEnvRep'] as $key => $value) {
                new DatDocumentoActivo();
                new DatDocumento();
                if(!$value->idregnumerico){
                    return false;
                }
                $objDatRegnumericoActivo = Doctrine::getTable('DatRegnumericoActivo')->find($value->idregnumerico);
                if (!empty($objDatRegnumericoActivo)) {
                    $datos = $objDatRegnumericoActivo->toArray();
                    foreach ($objRegNumAftModel->getListaPlugins() as $plugin) {
                        $objDatRegnumericoActivoTransp = $plugin->getDatRegnumericoActivoplugin($value->idregnumerico);
                        $datos = array_merge($datos, $objDatRegnumericoActivoTransp->toArray());
                    }
                    $valores[$key] = $datos;
                    $datDocumento = $this->adicionarDocumento($parametros);
                   
                    $datDocumento->$cDatDocumentoActivo->synchronizeWithArray($parametros);
                    $datDocumento->{get_class($oDatDocumento)}->synchronizeWithArray($parametros);
                    if ($parametros['datosEnvRep']) {
                        $parametros = $parametros['datosEnvRep'];
                        $valores = array();
    
                        //foreach ($parametros as $key => $value) {
                            if ($value->idregnumerico){
                                $objDatRegnumericoActivo = Doctrine::getTable('DatRegnumericoActivo')->find(
                                $value->idregnumerico
                                );
                                $datos = array_merge(
                                    $objDatRegnumericoActivo->toArray(), $objDatRegnumericoActivoTransp ? $objDatRegnumericoActivoTransp->toArray() : []
                                );
                            } 
                        //}
                        $datos['idprod'] = $value->idprod;
                        $valores[$key] = $datos;
                    }
                    new DatMovRegnumerico();
                    new DatMovRegnumericoActivo();
                    $valores[0]['idestructuracomun'] = $idestructuracomun;
                    $valores[0]['idestructura'] = $identidad;

                    $datDocumento = $sMovimiento->crearMovimiento($valores, $datDocumento);
                    
                    
                  
                    $datDocumento->save();
    
                    //  $mDocEntregaTemporal->addDocDeEntregaTemporal($datDocumento, $parametros);
                 
                    if($docCreadoDesdeOT){
                        // Confirmando documento
                        $this->confirmarDocumento($datDocumento->iddocumento);
                        
                        // Aprobando documento                 
                        $resp = $docService->aprobarDocumento($datDocumento->iddocumento, $datDocumento->idoperacion, $identidad);
                          
                    }
                    return $this->setDatosInterfazRegNumerico($datDocumento);
                }
                new DatMovRegnumerico();
                new DatMovRegnumericoActivo();
                $datDocumento = $sMovimiento->crearMovimiento($valores, $datDocumento);
                $datDocumento->save();

                //  $mDocEntregaTemporal->addDocDeEntregaTemporal($datDocumento, $parametros);
                if($docCreadoDesdeOT){
                    // Confirmando documento
                    $this->confirmarDocumento($datDocumento->iddocumento);

                    // Aprobando documento
                    //$docService = new DocumentoActivoService();
                    $resp = $docService->aprobarDocumento($datDocumento->iddocumento, $datDocumento->idoperacion, $identidad);   
                }
                return $this->setDatosInterfazRegNumerico($datDocumento);
            }
        }
    }

    /**
     *
     */
    public function getEstrucConOperacionesConfiguradas($parametros)
    {
        $subQuery = new Doctrine_Query();
        $subQuery->select('mr.idregnumerico AS idregnumerico');
        $subQuery->from('DatDocTransfereciaEntreAreas ta');
        $subQuery->innerJoin('ta.DatDocumento d');
        $subQuery->innerJoin('ta.DatMovimientos m');

        $mMovRegNum = new MovRegNumericoModel();
        $mMovRegNum->addJoinModelMy($subQuery, 'm', 'mr', 1);
        $subQuery->where('ta.iddocorigen = d.iddocumento');

        $resultSubQuery = $subQuery->fetchArray();
        $arrIdRegNumericos = array();

        foreach ($resultSubQuery as $value) {
            $arrIdRegNumericos[] = $value['idregnumerico'];
        }

        $arrIdesOperaciones = $this->_mComunAFT->getArrayIdOperacionesUtilizadas(
            false, false, $this->_arrOperaciones, false
        );

        $query = new Doctrine_Query();
        $query->select(
            'DISTINCT d.idoperacion AS idoperacion,
             d.idestructuracomun AS idestructuracomun,
             d.iddocumento AS iddocumento'
        );
        $query->from('DatDocTransfereciaEntreAreas ta');
        $query->innerJoin('ta.DatDocumento d');
        $query->innerJoin('ta.DatMovimientos m');

        $mMovRegNum = new MovRegNumericoModel();
        $mMovRegNum->addJoinModelMy($query, 'm', 'mr', 1);

        $query->whereIn('d.idoperacion', $arrIdesOperaciones);
        $query->whereNotIn('mr.idregnumerico', $arrIdRegNumericos);
        $query->addWhere('d.estado = ?', array(3));

        $total = $query->count();

        if ($parametros['limit']) {
            $this->_mComunAFT->configStartAndLimitInParams($parametros, $parametros['start'], $parametros['limit']);
            $query->offset($parametros['start']);
            $query->limit($parametros['limit']);
        }

        $documentos = $query->fetchArray();

        $datos = Array();
        foreach ($documentos as $documento) {

            //$estructura = $this->_sEstrComposicion->getEstructura($documento['idestructuracomun']);
            $estructura = $this->integrator->metadatos->DameEstructura($documento['idestructuracomun']);

            $datos[] = array('identidaddestino' => $estructura[0]->idestructura,
                'descripcion' => $estructura[0]->denominacion);
        }

        return array('datos' => $datos, 'total' => $total);
    }

    public function getEnviadoRepararDoc($parametros)
    {
        $regNumServiceAFT = new RegNumActivoService();
        $parametros['tipo'] = ($this->idsubsistema == 11) ? 0 : 1;
        /* $datos = $regNumServiceAFT->getRegNumEntregadosReparacion(
             $parametros, $this->_arrOperaciones, array(5), 'enviadoreparar'
         );    */
        // print_r($parametros);die;
        $parametros['envrep'] = 1;
        $datos = $regNumServiceAFT->getRegNumPorEstadoOperacion($parametros, array(5));
        $parametros['datos'] = $datos;
        if (
        LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_TALLERES)
        ) {

            $band = true;
            $ordenTrabajo = new OrdenTrabajoTalleresService();
            $ordenTra = $ordenTrabajo->devolverEnviadosATallerConEstado($parametros);
        }
        if ($band) {
            $datos = $ordenTra;
        }
        // $datos = $this->getEnviadoRepararDocForeach($datos);

        return array("datos" => $datos, "total" => count($datos), "cantidad" => count($datos));
    }

    public function getEnviadoRepararDocForeach($ordenTra)
    {
        foreach ($ordenTra as $res) {
            $res['idindicador'] = $res['id'];
            if ($res['denomconfmedio'] && $res[$res['identificador']]) {
                $res['denomidmedio'] = $res['denomconfmedio'] . ': ' . $res[$res['identificador']];

            }
            unset($res['id']);
            /* if ($res['estadoregistronumerico'] == "enespera") {
              $res['noRecepcion'] = 'No procesado';
              } else */
            if ($res['estadoregistronumerico'] == "enproceso") {
                $res['noRecepcion'] = 'En proceso';
            } else {
                if ($res['estadoregistronumerico'] == "terminado") {
                    $res['noRecepcion'] = 'Reparado';
                } else {
                    $res['estadoregistronumerico'] = "enespera";
                    $res['noRecepcion'] = 'No procesado';
                }
            }
            $datos[] = $res;
        }
        return $datos;
    }


    public function crearDocumentoEnvRepAutomatico($codigoOperacion, $idusuario, $arrDatosDocumetos, $idregistronumerico)
    {
        // Buscar el id de la operacion
        $idoperacion = $this->_mComunAFT->getArrayIdOperacionesUtilizadas(null, null, $codigoOperacion, null);
        if (count($idoperacion) == 0) {
            die("No existen operaciones configuradas para el codigo de la operacion " . $codigoOperacion);
        } else {
            $idoperacion = $idoperacion[0];

            $cEstructura = 'Estructura';
            $idestructura = ZendExt_GlobalConcept::getInstance()->$cEstructura->idestructura;


            $rnActService = new RegNumActivoService();
            $datos = $rnActService->getRegNumericoDat(array('idregnumerico' => $idregistronumerico));
            $idestructuraMedio = $datos[0]['idestructura'];

            $idestructura = ($idestructura != $idestructuraMedio)?$idestructuraMedio:$idestructura;

            $operacion = $this->_sConfGeneral->obtenerOperaciones($idestructuraMedio, $idsubsistema,
                null, $idoperacion);

            // Buscar el id del documento
            $iddocentidad = $operacion[0]['iddocentidad'];

            // Crear el documento y guardarlo
            $docLogModel = new DocumentoLogisticaModel(array('subsistema' => $idsubsistema));

            // Para inicialiar la relacion de uno a uno de documento logistica hacia documentoaft
            new DatDocumentoActivo();

            $parametros = array();
            $parametros['iddoc'] = $iddocentidad;
            $parametros['idoperacion'] = $operacion[0]['idnomoperaciones'];

            $datos[0]['idprod'] = $datos[0]['idindicador'];

            $parametros['idestructuracomun'] = $datos[0]['idarearesp'];

            $docLog = $docLogModel->adicionarDocumento($parametros);
            $docLog->DatDocumentoActivo->DatDocEnviadoReparar;
            $docLog->save();
            
            // Crear el movimiento y guardarlo            
            $prod = Doctrine::getTable('DatProductoLogistica')->find($datos[0]['idproducto']);
            $datos[0]['idestructura'] = $prod->idestructura;
            $datos[0]['idestructuracomun'] = $prod->idestructuracomun;
            $movService = new MovimientoService();
            $docLog = $movService->crearMovimiento($datos, $docLog);
            $docLog->save();

            // Confirmando documento
            $this->confirmarDocumento($docLog->iddocumento);

            // Aprobando documento
            $docService = new DocumentoActivoService();
            $resp = $docService->aprobarDocumento($docLog->iddocumento, $docLog->idoperacion, $idestructura);
            return $docLog;
        }
    }

    public function eliminarDocEnvRepAutomatico($iddocumento)
    {
        $del = Doctrine::getTable('DatDocumento')->find($iddocumento);
        if ($del) {
            // Ponerle al RN el idestadooperacion 1;
            new DatMovRegnumerico();

            $idregnumerico = $del->DatMovimientos[0]->DatMovRegnumerico[0]->idregnumerico;
            $rn = Doctrine::getTable('DatRegnumericoActivo')->find($idregnumerico);
            $rn->idestadoperacion = 1;
            $rn->save();

            unset($del->DatMovimientos);

            $del->delete();
            return true;
        }
        return false;
    }

    public function buscarTransportador($idpersona){

        $query = Doctrine_Query::create();
        $query->from('DatDocEnviadoReparar envrep');
        $query->addSelect('envrep.idtransportador');
        $query = ServiciosRecursosHumanosHelper::__init()->agregarDqlDatosPersona(
            $query, 'envrep', 'persona', false, array(), 'leftjoin'
        );
        $query->where("envrep.idtransportador = {$idpersona}");
        $query->addSelect(
            "persona.nombre as nombreprestamo,persona.snombre as snombreprestamo,"
            . "persona.papel as papelprestamo,persona.sapel as sapleprestamo"
        );

        return $query->fetchArray();
    }
}
