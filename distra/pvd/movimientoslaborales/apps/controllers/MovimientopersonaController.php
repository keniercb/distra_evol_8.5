<?php

$direccionComun = Zend_Registry::getInstance()->config->dir_aplication . "pvd/comun/recursos/fpdf/fpdf.php";
include($direccionComun);
include_once(Zend_Registry::get('config')->dir_aplication . '/pvd/comun/recursos/zip_min.php');

/**
 * User: yari
 * Date: 25/05/16
 */
class MovimientopersonaController extends ZendExt_Controller_Secure {

    protected $_objSitLabModel, $_objSitLab;

    public function init() {
        $this->_objSitLabModel = new DatSituacionlaboralModel();
        $this->_objSitLab = new DatSituacionlaboral();
        parent::init();
    }

    function movimientopersonaAction() {
        $this->view->estructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->plantilla = ZendExt_IoC_Inter::getInstance()->maestro->mostrarIUPlantilla();
        $this->render();
    }

    function esCuadroAction() {
        $rp = DatPersonaentidad::esCuadro($this->_getParam('idcargop'));
        $r = DatPersonaentidad::esCuadro($this->_getParam('idcargo'));
        if ($rp == 1) {
            echo json_encode(1);
        } else if ($r == 1) {
            echo json_encode(2);
        } else {
            echo json_encode(3);
        }
    }

    function updMotivoAction() {
        $r = $this->_objSitLabModel->updMotivo(
                $this->_getParam('idsituacionlaboralp'),
                $this->_getParam('idmotivo')
        );
        echo json_encode($r);
    }

    function darBajaAction() {
        $idsituacionlaboralp = $this->_getParam('idsituacionlaboralp');
        $idmotivoBaja = $this->_getParam('idmotivobaja');
        $fecha = $this->_getParam('fecha');
        $respuesta = $this->_objSitLabModel->darBaja(
                $idsituacionlaboralp,
                $idmotivoBaja,
                $fecha
        );
        //Guardar info para generar el movimiento de nomina.
        $objmovnom = new MovimientonominaModel();
        $objmovnom->guardarContenidoMovNomina($idsituacionlaboralp);
        echo json_encode($respuesta);
    }

    // function titulosERAction()
    // {
    //     $filtros = $this->_getParam('query');
    //    $especialidad= ReporteEmpleoRemuneracion::Titulos($filtros); //print_r($titulos);//die;
    //    echo json_encode($titulos);
    // }

    function especialidadERAction() {
        $filtros = $this->_getParam('query');
        $titulos = ReporteEmpleoRemuneracion::Especialidad($filtros);
        echo json_encode($titulos);
    }

    function darAltaAction() {
        $datosSitLab = new stdClass();
        $datosSitLab->idpersona = $this->_getParam('idpersona');
        $datosSitLab->identidad = $this->_getParam('identidad');
        $datosSitLab->fdesde = $this->_getParam('fdesde');
        $datosSitLab->fhasta = $this->_getParam('fhasta');
        $datosSitLab->idcargo = $this->_getParam('idcargo');
        $datosSitLab->idsituacion = $this->_getParam('idsituacion');
        $datosSitLab->noalta = $this->_getParam('noalta');
        $datosSitLab->idtipocontrato = $this->_getParam('idtipocontrato');
        $datosSitLab->idarea = $this->_getParam('idarea');
        $datosSitLab->ueb = $this->_getParam('ueb');
        $datosSitLab->principal = $this->_getParam('principal');
        $datosSitLab->idprocedenciasocial = $this->_getParam('idprocedenciasocial');
        $datosSitLab->idcandidato = $this->_getParam('idcandidato');
        $datosSitLab->idespcargo = $this->_getParam('idespcargo');
        $datosSitLab->idprograma = $this->_getParam('idprograma');
        $datosSitLab->cargo = $this->_getParam('cargo');
        $datosSitLab->idmodalidadempleo = $this->_getParam('idmodalidadempleo');
        $datosSitLab->funciones = $this->_getParam('funciones');
        $idestructuramn = (empty($datosSitLab->ueb)) ? $datosSitLab->identidad : $datosSitLab->ueb;
        $nromnom = MovimientonominaModel::getNumeroConsecutivo($idestructuramn);
        $now = explode('/', date('d/m/Y'));
        $nromn = (!empty($nromnom['nro']) && $now[2] == $nromnom['anno']) ? $nromnom['nro'] + 1 : 1;
        MovimientonominaModel::addupdNumeroConsecutivo(
                $idestructuramn, $nromn, $now[2], ($nromnom['nro']) ? 0 : 1
        );
        $datosSitLab->nromn = $nromn;
        $respuesta = $this->_objSitLabModel->darAlta($datosSitLab);
        //Guardar info para generar el movimiento de nomina.
        $objmovnom = new MovimientonominaModel();
        $objmovnom->guardarContenidoMovNomina(null, $respuesta->idsituacionlaboralp);
        echo json_encode($respuesta);
    }

    function setAltaAction() {
        $datosSitLab = new stdClass();
        $datosSitLab->idsituacionlaboralp = $this->_getParam('idsituacionlaboralp');
        $datosSitLab->identidad = $this->_getParam('identidad');
        $datosSitLab->fdesde = $this->_getParam('fdesde');
        $datosSitLab->fhasta = $this->_getParam('fhasta');
        $datosSitLab->idcargo = $this->_getParam('idcargo');
        $datosSitLab->idsituacion = $this->_getParam('idsituacion');
        $datosSitLab->noalta = $this->_getParam('noalta');
        $datosSitLab->idtipocontrato = $this->_getParam('idtipocontrato');
        $datosSitLab->idarea = $this->_getParam('idarea');
        $datosSitLab->ueb = $this->_getParam('ueb');
        $datosSitLab->principal = $this->_getParam('principal');
        $datosSitLab->idprocedenciasocial = $this->_getParam('idprocedenciasocial');
        $datosSitLab->idespcargo = $this->_getParam('idespcargo');
        $datosSitLab->idprograma = $this->_getParam('idprograma');
        $datosSitLab->cargo = $this->_getParam('cargo');
        $datosSitLab->idmodalidadempleo = $this->_getParam('idmodalidadempleo');
        $datosSitLab->idmotivomovimiento = $this->_getParam('idmotivomovimiento');
        $datosSitLab->funciones = $this->_getParam('funciones');
        $respuesta = $this->_objSitLabModel->setAlta($datosSitLab);
        echo json_encode($respuesta);
    }

    function realizarMovimientoAction() {
        $datosSitLab = new stdClass();
        $datosSitLab->idsituacionlaboralp = $this->_getParam('idsituacionlaboralp');
        $datosSitLab->idmotivomovimiento = $this->_getParam('idmotivomovimiento');
        $datosSitLab->fdesde = $this->_getParam('fdesde');
        $datosSitLab->fhasta = $this->_getParam('fhasta');
        $datosSitLab->idcargo = $this->_getParam('idcargo');
        $datosSitLab->idsituacion = $this->_getParam('idsituacion');
        $datosSitLab->noalta = $this->_getParam('noalta');
        $datosSitLab->idtipocontrato = $this->_getParam('idtipocontrato');
        $datosSitLab->idarea = $this->_getParam('idarea');
        $datosSitLab->ueb = $this->_getParam('ueb');
        $datosSitLab->idespcargo = $this->_getParam('idespcargo');
        $datosSitLab->idprograma = $this->_getParam('idprograma');
        $datosSitLab->cargo = $this->_getParam('cargo');
        $datosSitLab->idmodalidadempleo = $this->_getParam('idmodalidadempleo');
        $datosSitLab->idmotivomovimiento = $this->_getParam('idmotivomovimiento');
        $datosSitLab->funciones = $this->_getParam('funciones');
        $respuesta = $this->_objSitLabModel->realizarMovimiento($datosSitLab);
//        $mg = Doctrine_Manager::getInstance();
//        $conn = $mg->getCurrentConnection();
        //Guardar info para generar el movimiento de nomina.
        $objmovnom = new MovimientonominaModel($respuesta->idpersona);
        $objmovnom->guardarContenidoMovNomina($datosSitLab->idsituacionlaboralp, $respuesta->idsituacionlaboralpnueva);
//        //Actualizar cargos en dat_cargosocupados
//        $sql = "UPDATE mod_nomina.dat_cargosocupados SET idcargo = $datosSitLab->idcargo WHERE idpersona = $respuesta->idpersona;";
//        $r = $conn->fetchAll($sql);
        echo json_encode($respuesta);
    }

    function getHistoricoAction() {
        $datos = $this->_objSitLabModel->getSituacionLaboral(
                $this->_getParam('query'),
                $this->_getParam('idestructura'),
                $this->_getParam('idcargo'),
                $this->_getParam('start'),
                $this->_getParam('limit'),
                0,
                $this->_getParam('idconcepto'),
                $this->_getParam('desde'),
                $this->_getParam('hasta'),
                $this->_getParam('estado'),
                $this->_getParam('motivo'),
                $this->_getParam('filtros')
        );

        foreach ($datos->datos as $k => $val) {
            if ($val['estado'] == 1 || $val['estado'] == 2) {
                $motivo = $this->_objSitLab->getMotivoBajaSituacionLabById($val['idsituacionlaboralp'], $val['estado']);
                $datos->datos[$k]['motivo'] = $motivo[0]['motivo'];
            } else {
                $datos->datos[$k]['motivo'] = '';
            }
        }

        echo json_encode($datos);
    }

    function getPersonasAction() {
        $arrEst = json_decode(stripslashes($this->_getParam('arrayEst')));

        $vioc = ZendExt_IoC_Inter::getInstance();
        $datos = new stdClass();
        if ($this->_getParam('alta') == 1) {//Personas seleccionadas
            $datos = $vioc->seleccion->getCandidatosSeleccionadosByUbicacion(
                    $this->_getParam('start'), $this->_getParam('limit'),
                    $arrEst, $this->_getParam('idcargo'), $this->_getParam('numid'), $this->_getParam('nombre'), $this->_getParam('papel'), $this->_getParam('sapel')
            );
        } else if ($this->_getParam('alta') == 2) {//Personas sin situacion
            $datos = $this->_objSitLabModel->getPersonasSinSituacion(
                    $this->_getParam('query'), $this->_getParam('start'),
                    $this->_getParam('limit'), $this->_getParam('numid'), $this->_getParam('nombre'), $this->_getParam('papel'), $this->_getParam('sapel')
            );
        } else if ($this->_getParam('alta') == 3) {//Todas
            $datos = $this->_objSitLabModel->obtenerPersonasActivas(
                    $this->_getParam('query'), $this->_getParam('start'),
                    $this->_getParam('limit'), $this->_getParam('numid'), $this->_getParam('nombre'), $this->_getParam('papel'), $this->_getParam('sapel')
            );
        } else {
            $datos = $this->_objSitLabModel->getSituacionLaboral(
                    $this->_getParam('query'), $this->_getParam('idestructura'),
                    $this->_getParam('idcargo'), $this->_getParam('start'),
                    $this->_getParam('limit'), 1, $this->_getParam('idconcepto'), null, null, null, null, $this->_getParam('filtros')
            );
        }
        echo json_encode($datos);
    }

    function getCompletamientoAction() {
        $datos = $this->_objSitLabModel->getCompletamiento(
                $this->_getParam('concepto'),
                $this->_getParam('idestructura')
        );
        echo json_encode($datos);
    }

    function getEntidadByCargoAction() {
        $entidad = ZendExt_IoC::getInstance()->metadatos->BuscarEntidadXidcargo(
                $this->_getParam('idcargo')
        );
        echo json_encode($entidad);
    }

    function getProblemasDetectadosAction() {
        set_time_limit(30000);
        $datos = $this->_objSitLabModel->getProblemasDetectados();
        echo json_encode($datos);
    }

    function getProcedenciaSocialAction() {
        $obj = new NomProcedenciasocialModel();
        $datos = $obj->getProcedencia();
        echo json_encode($datos);
    }

    function getSituacionAction() {
        $cargoAsociado = null;
        $vioc = ZendExt_IoC_Inter::getInstance();
        if ($this->_getParam('cargoasociado') == 0) {
            $cargoAsociado = false;
        } else {
            $cargoAsociado = true;
        }
        $datos = $vioc->movimientoslaborales->getActiveSituaciones(
                $cargoAsociado
        );
        echo json_encode($datos);
    }

    function getMotivoBajaAction() {
        $obj = new NomMotivobajaModel();
        $datos = $obj->getMotivoBaja();
        echo json_encode($datos);
    }

    function getMotivoMovimientoAction() {
        $obj = new NomMotivomovimientoModel();
        $datos = $obj->getMotivoMovimiento();
        echo json_encode($datos);
    }

    function getTiposContratoAction() {
        $identidad = $this->global->Estructura->idestructura;
        $obj = new NomTipocontratoModel();
        $datos = $obj->getActiveTiposContrato($identidad);
        echo json_encode($datos);
    }

    function getMotivosInterrupcionAction() {
        $obj = new NomMotivointerrupcionModel();
        $datos = $obj->getMotivosActivos();
        echo json_encode($datos);
    }

    function getModalidadesempleoAction() {
        $obj = new NomModalidadempleoModel();
        $datos = $obj->getModalidadesActivos();
        echo json_encode($datos);
    }

    function deletePersonaSitLabAction() {
        $arrayids = json_decode(
                stripslashes($this->_request->getPost('arrayidsituacionlaboralp'))
        );
        $respuesta = true;
        foreach ($arrayids as $p) {
            $r = $this->_objSitLabModel->deleteSituacionLaboral($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }

    function getDatosSituacionLaboralAction() {
        $datos = $this->_objSitLabModel->getSituacionLabById(
                $this->_getParam('idsituacionlaboralp')
        );
        echo json_encode($datos);
    }

    function getEstructuraCargoAction() {
        try {
            $result = Array();
            if ($this->_getParam('node') == 0 && $this->_getParam('idestructura') != 0) {
                $id = $this->_getParam('idestructura');
                $estr = ZendExt_IoC::getInstance()->metadatos->DameEstructura($id);
                array_push($result, $estr[0]);
            } else {
                $id = $this->_getParam('node');
                $r = ZendExt_IoC::getInstance()->metadatos->DameHijosEstructura($id);
                foreach ($r as $est) {
                    if ($est->idconcepto == 7) {
                        $est->text = $est->text . " <b>($est->cantidad | $est->cantidad_real)</b>";
                    }
                    array_push($result, $est);
                }
            }
            echo json_encode($result);
        } catch (Exception $e) {
            echo json_encode(Array());
        }
    }

    function updateCompletamientoCargoAction() {
        $nodo = $this->_getParam('node');
        $idestructura = ($nodo == -1) ? $this->global->Estructura->idestructura : $nodo;
        $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, true);
        if (count($cargos) > 0) {
            foreach ($cargos as $h => $carg) {
                $idcargos[$h] = $carg['idcargo'];
            }
            $respuesta = $this->_objSitLabModel->updateCompletamientoCargo($idcargos);
        } else {
            $respuesta = true;
        }
        echo json_encode($respuesta);
    }

    function getPersonasAsignadasAction() {
        $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura(
                $this->_getParam('idestructura'), true
        );
        $datos = Array();
        foreach ($cargos as $carg) {
            $select = ZendExt_IoC_Inter::getInstance()->seleccion->getCandidatosSeleccionadosByUbicacion(
                    null, null, $this->_getParam('query'), $this->_getParam('idestructura'),
                    $carg['idcargo']
            );
            foreach ($select->datos as $v) {
                $pos = count($datos);
                $datos[$pos] = $v;
                $cargo = ZendExt_IoC::getInstance()->metadatos->DameEstructura($carg['idcargo']);
                $cargo = $cargo[0]->denominacion;
                $datos[$pos]['cargo'] = $cargo;
            }
        }
        echo json_encode($datos);
    }

    function getEspecializacionesByCargoAction() {
        $datos = $this->_objSitLab->getEspecializacionesByCargo($this->_getParam('idcargo'));
        echo json_encode($datos);
    }

    function dameConfiguracionEstructuraAction() {
        $obj = new ConfEntidadModel();
        $datos = $obj->existeEntidad($this->_getParam('ueb'), $this->_getParam('identidad'));
        echo json_encode($datos);
    }

    function generarDocContratoAction() {
        $plantilla = ZendExt_IoC_Inter::getInstance()->maestro->getContenidoReemplazado(
                $this->_getParam('idpersona'), $this->_getParam('idplantilla')
        );
        $contenido = $plantilla->contenido;
        $test = new GenerarDoc();
        $test->ConstruirDocumento($contenido);
        return true;
    }

    function generarPlazasVacAction() {
        $idestructura = $this->_getParam('idestructura');
        $objReportePDF = new ReportePlazasVacantesModel();
        $objReportePDF->CrearReportePDF($idestructura);
        return true;
    }

    function generarReporteModeloAction() {
        $idestructura = $this->_getParam('idestructura');
        $objReportePDF = new ReportepdfmodeloModel();
        $objReportePDF->CrearReportePDF($idestructura);
        return true;
    }

    function generarReporteModeloPTSCAction() {
        $idestructura = $this->_getParam('idestructura');
        $iniciot = $this->_getParam('iniciot');
        $fint = $this->_getParam('fint');
        $inicios = $this->_getParam('inicios');
        $fins = $this->_getParam('fins');
        $objReportePDF = new ReporteProtTrabSegSocialModel();
        $objReportePDF->CrearReportePDFPTSC($idestructura, $iniciot, $fint, $inicios, $fins);
        return true;
    }

    function generarReporteModeloERAction() {
        $idestructura = $this->_getParam('idestructura');
        $fdesde = $this->_getParam('fdesde');
        $fhasta = $this->_getParam('fhasta');
        $semi = $this->_getParam('semi');
        $semf = $this->_getParam('semf');
        $idesp = array();
        $idesp = Zend_Json::decode(stripslashes($this->_getParam('idesp')));  //print_r($idesp);die;
        $objReportePDF = new ReporteEmpleoRemuneracionModel();
        $objReportePDF->CrearReportePDFER($idestructura, $fdesde, $fhasta, $semi, $semf, $idesp);
        return true;
    }

    function generarPdfReportesAction() {
        $tiporeporte = $this->_getParam('tiporeporte');
        $idestructura = $this->_getParam('idestructura');
        $idconcepto = $this->_getParam('idconcepto');
        $fdesde = $this->_getParam('fdesde');
        $fhasta = $this->_getParam('fhasta');
        $altaobaja = $this->_getParam('altaobaja');
        if ($tiporeporte == 1) {
            $objReportePDF = new ReportepdfaltasbajasModel();
        } else if ($tiporeporte == 2) {
            $objReportePDF = new ReportepdftrabajadoresModel();
        }
        $objReportePDF->CrearReportePDF($idestructura, $idconcepto, $fdesde, $fhasta, $altaobaja);
        return true;
    }

    function getCargosNomencladorTodosAction() {
        $cargos = DatSituacionlaboral::getCargosFacultados();
        echo Zend_Json::encode($cargos);
    }

    function getCatOcupAction() {
        $cargos = DatSituacionlaboral::getCatOcup();
        echo Zend_Json::encode($cargos);
    }

    function generarRepHistoricoAction() {
        $idestructura = $this->_getParam('idestructura');
        $idcategocup = null;
        if ($this->_getParam('idcategocup')) {
            $idcategocup = explode(',', $this->_getParam('idcategocup'));
        }
        $categocup = $this->_getParam('categocup');
        $decisorio = $this->_getParam('decisorio');
        $idfacultado = $this->_getParam('idfacultad');
        $facultado = $this->_getParam('facultad');
        $finicio = $this->_getParam('fdesde');
        $ffin = $this->_getParam('fhasta');
        $excel = $this->_getParam('excel');
        if ($excel == 1) {
            $model = new ReporteexcelhistModel();
            $model->exportarExcel(
                    $idestructura, $idcategocup, $categocup, $decisorio, $idfacultado, $facultado, $finicio, $ffin
            );
        } else {
            $objReportePDF = new ReportepdfhistoricoModel();
            $objReportePDF->CrearReportePDF(
                    $idestructura, $idcategocup, $categocup, $decisorio, $idfacultado, $facultado, $finicio, $ffin
            );
        }

        return true;
    }

    public function exportarMovimientonominaAction() {
        ini_set("max_memory_limit", "1024M");
        ini_set("max_execution_time", 300);
        $datos = json_decode(stripslashes($this->_getParam('datos')));
        $movimietoNomina = new MovimientonominaModel();
        $movimietoNomina->construirReporte($datos);
        return true;
    }

    public function actualizarMovimientosNominaAction() {
        $idestructura = $this->_getParam('idestructura');
        $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, true);
        if (count($cargos) > 0 || !empty($idconcepto)) {
            $idcargos = DatSituacionlaboralModel::getIdCargos($cargos);
        }
        $objmn = new MovimientonominaModel();
        $res = $objmn->actualizarMovimientosNomina($idcargos);
        echo Zend_Json::encode($res);
    }

    public function getElaboradoAction() {
        $idestructura = $this->global->Estructura->idestructura;
        $obj = new DatSituacionlaboralModel();
        $datos = $obj->getElaborado($idestructura);
        echo Zend_Json::encode(array('datos' => $datos, 'cantidad' => count($datos)));
    }

    public function getAprobadoAction() {
        $idestructura = $this->global->Estructura->idestructura;
        $obj = new DatSituacionlaboralModel();
        $datos = $obj->getAprobado($idestructura);
        echo Zend_Json::encode(array('datos' => $datos, 'cantidad' => count($datos)));
    }

    public function getProgramaAction() {
        $datos = NomProgramalaboralModel::getProgramasActivos();
        echo Zend_Json::encode(array('datos' => $datos, 'cantidad' => count($datos)));
    }

    public function exportarAnexo3Action() {
        $idestructura = $this->_getParam('idestructura');
        ;
        $objReportePDF = new Anexo3Model();
        $objReportePDF->construirReporte($idestructura);
        return true;
    }

    public function getContenidoPlantillaFichaAction() {
        $obj = new DatPlantillatipocontratoModel();
        $contenido = $obj->getContenidoPlantillaFicha();
        echo Zend_Json::encode($contenido);
    }

    public function generarPDFRelacionCargosAction() {
        $idestructura = $this->_getParam('idestructura');
        $decisorios = $this->_getParam('decisorios');
        $facultad = $this->_getParam('facultad');
        $denfacultad = $this->_getParam('denfacultad');
        $reportePDF = new ReportepdfrelacioncargosModel();
        $reportePDF->CrearReportePDF($idestructura, $decisorios, $facultad, $denfacultad);
    }

    function generarExcelRelacionCargosAction() {
        $idestructura = $this->_getParam('idestructura');
        $decisorios = $this->_getParam('decisorios');
        $facultad = $this->_getParam('facultad');
        $model = new ReporteexcelrelacioncargoModel();
        $model->exportarExcel($idestructura, $decisorios, $facultad);
        return true;
    }

    function generarListadoNivelCargoAction() {
        $idestructura = $this->_getParam('idestructura');
        $reporte = new ReportepdtrabajadoresnivelcargoModel();
        $reporte->CrearReportePDF($idestructura);
    }

    function generarListadoCuadrosAction() {
        $idestructura = $this->_getParam('idestructura');
        $reporte = new ReportepdfListadoCuadrosModel();
        $reporte->CrearReportePDF($idestructura);
    }

    function generarReporteEstructuraComposicionAction() {
        $idestructura = $this->_getParam('idestructura');
        $reporte = new ReportepdfCantPlazasAprobadasYCubiertasModel();
        $reporte->CrearReportePDF($idestructura);
    }

    function generarReporteFuncionesespecificasAction() {
        $idsituacionlaboralp = $this->_getParam('idsituacionlaboralp');
        $model = new ReportepdfFuncionesespecificasModel();
        $model->CrearReportePDF($idsituacionlaboralp);
        return true;
    }

    function generarListadoCargosAction() {
        $idestructura = $this->_getParam('idestructura');
        $estructura = $this->_getParam('estructura');
        $tipo = $this->_getParam('tipo');
        $model = new ReporteexcelcargosestructurasModel();
        $model->exportarExcel($idestructura, $estructura, $tipo);
        return true;
    }

    function exportarExistenciaFTAction() {
        $idestructura = $this->_getParam('idestructura');
        $arr_clientes = DatPersonaentidadModel::getExistenciaFT($idestructura);
        $json_string = json_encode($arr_clientes);
        $file = 'existenciaft.json';
        $zipfile = new zipfile();
        $zipfile->addFile($json_string, $file);
        header("Content-type: application/octet-stream");
        header("Content-disposition: attachment; filename=existenciaft.zip");
        echo $zipfile->file();
    }

    function importarExistenciaFTAction() {
        $respuesta = new stdClass();
        $respuesta->codMsg = 1;
        $obj = new DatPersonaentidadModel();
        $dirFile = $_FILES['fileUpload']['tmp_name'];
        if ($_FILES['fileUpload']['type'] == 'application/json') {
            if (file_exists($dirFile)) {
                $contenido = file_get_contents($dirFile);
                $array_contenido = json_decode($contenido, true);
                foreach ($array_contenido as $entidad) {
                    foreach ($entidad['existencia'] as $persona) {
                        $r = $obj->addpersona(
                                $persona['numid'], $persona['sexo'], $persona['nombre'], $persona['snombre'],
                                $persona['papel'], $persona['sapel'], $persona['idsuin']
                        );
                        $idpersonaentidad = $obj->addPersonaEnt($r['idpersona'], $persona['idprocedencia'], $persona['identidad'], $persona['falta'], $persona['fbaja']);
                        DatPersonaentidad::addSitLabDirecto($idpersonaentidad, $persona);
                    }
                }
                $respuesta->mensaje = 'Los datos han sido importados satisfactoriamente.';
                $respuesta->success = 'true';
                echo json_encode($respuesta);
            } else {
                $respuesta->codMsg = 6;
                $respuesta->mensaje = 'El archivo introducido no es válido.';
                $respuesta->failure = 'true';
                echo json_encode($respuesta);
            }
        } else {
            $respuesta->codMsg = 6;
            $respuesta->mensaje = 'El archivo introducido no es válido.';
            $respuesta->failure = 'true';
            echo json_encode($respuesta);
        }

        function obtenerConfigUEBAction() {
            $model = new ConfEntidadModel();
            echo Zend_Json::encode($model->getConfig());
        }

        function guardarTrasladoEnvioAction() {
            $trasladoModel = new TrasladoUebModel();
            echo Zend_Json::encode($trasladoModel->guardarTrasladoUEB($this->_getParam('idpersona'), $this->_getParam('idsituacionlaboral'), $this->_getParam('idueb')));
        }

        function obtenerTrasladosUebAction() {
            $trasladoModel = new TrasladoUebModel();
            echo Zend_Json::encode($trasladoModel->obtenerTrasladoUEB());
        }

    }

}
