<?php

$dir_www = $_SERVER["DOCUMENT_ROOT"];
//Direccion del Marco de trabajo relativa a la carpeta de publicacion.
$dir_rel_mt = "/";
//Direccion absoluta del marco de trabajo
$dir_abs_mt = str_replace("//", "/", dirname($dir_www . "..") . "/" . $dir_rel_mt);
$config["include_path"] = get_include_path();

$config['include_path'] .= '' . PATH_SEPARATOR . $dir_abs_mt . 'apps/planificacion/inversiones/comun/lib/tcpdf/';
$config['include_path'] .= '' . PATH_SEPARATOR . $dir_abs_mt . 'apps/planificacion/inversiones/comun/lib/tcpdf/config/';
$config['include_path'] .= '' . PATH_SEPARATOR . $dir_abs_mt . 'apps/planificacion/inversiones/comun/lib/tcpdf/fonts/';
$config['include_path'] .= '' . PATH_SEPARATOR . $dir_abs_mt . 'apps/planificacion/inversiones/comun/lib/tcpdf/include/';
$config['include_path'] .= '' . PATH_SEPARATOR . $dir_abs_mt . 'apps/planificacion/inversiones/comun/lib/tcpdf/tools/';
set_include_path($config["include_path"]);

class GestreportesinversionesController extends ZendExt_Controller_Secure {

    public function init() {
        // $this->_meta = ZendExt_Metadata::getInstance();
        parent::init();
    }

    public function gestreportesinversionesAction() {
        //$jsayuda = $this->integrator->ayuda->devolverJS();
        try {
            $this->view->jsreportes = $this->pIntegrator->reportes->devolverJS();
        } catch (Exception $exc) {
            echo Zend_Json::encode(array('success' => false, 'codMsg' => 4, 'mensaje' => $exc->getMessage(), 'detalles' => $exc->getTraceAsString()));
        }
        $this->view->jsayuda = $jsayuda;
        $this->render();
    }

    public function cargarDatosNomReporteAction() {
        $model = new InversionesReportesModel();
        echo json_encode($model->getRptByIdRpt($this->_request->getPost('idreporte')));
    }

    //Carga los ejercicios del sistema
    public function listarEjerciciosAction() {
        $data->data = NomEjercicioplanificacion::listarEjercicioActualByUri();
        $data->idejercicioactual = NomEjercicioplanificacion::obtenerDenEjercicioActual();
        echo json_encode($data);
    }

    //Este metodo carga las entidades...
    public function cargarTreeNomencladoresAction() {
        $model = new InversionesReportesModel();
        echo json_encode($model->cargarEntidadesArbol($this->_request->getPost()));
    }

    public function getReportesAction() {
        $model = new InversionesReportesModel();
        echo json_encode($model->getReportes());
    }

    public function getMedioAmbienteAction() {
        $model = new InversionesReportesModel();
        echo json_encode($model->cargarMedioAmbiente());
    }

    public function getObjetivosAction() {
        $model = new InversionesReportesModel();
        echo json_encode($model->cargarObjetivos());
    }

    public function cargarEntidadesAction() {
        $model = new InversionesReportesModel();
        echo json_encode($model->cargarEntidadesHijas(json_decode(stripslashes($this->_request->getPost('arrayIdOrganismo')))));
    }

    public function getFormaPropiedadAction() {
        $model = new InversionesReportesModel();
        echo json_encode($model->cargarFormaPropiedad());
    }

    public function getEfectoAction() {
        $model = new InversionesReportesModel();
        echo json_encode($model->cargarEfectos());
    }

    public function getMonedaAction() {
        $model = new InversionesReportesModel();
        echo json_encode($model->cargarMonedas());
    }

    public function getProvinciaAction() {
        $model = new InversionesModel();
        echo json_encode(array('data' => 'dededede'));
    }

    public function getDesempenoAction() {
        $model = new InversionesReportesModel();
        echo json_encode($model->cargarDesempennos());
    }

    public function getClasificacionAction() {
        $model = new InversionesReportesModel();
        echo json_encode($model->cargarClasificaciones());
    }

    public function getProgramaAction() {
        $model = new InversionesReportesModel();
        echo json_encode($model->cargarProgramas());
    }

    public function getTipoInvAction() {
        $model = new InversionesReportesModel();
        echo json_encode($model->cargarTiposInversion());
    }

    public function getQuienfinanciaAction() {
        $model = new InversionesReportesModel();
        echo json_encode($model->cargarQuienfinancia());
    }

    public function getComofinanciaAction() {
        $model = new InversionesReportesModel();
        echo json_encode($model->cargarComofinancia());
    }

    public function getComprarAction() {
        $model = new InversionesReportesModel();
        echo json_encode($model->cargarComprar());
    }

    public function getOrganoSatisfaceAction() {
        $model = new InversionesReportesModel();
        echo json_encode($model->cargarOrganoSatisface());
    }

    public function getPaisAction() {
        $model = new InversionesReportesModel();
        echo json_encode($model->cargarPais());
    }

    public function getAquirirAction() {
        $model = new InversionesReportesModel();
        echo json_encode($model->cargarAdquirir());
    }

    public function getNivelAction() {
        $model = new InversionesReportesModel();
        echo json_encode($model->cargarNivel());
    }

    public function getConstructorAction() {
        $model = new InversionesModel();
        echo json_encode(array('data' => 'dededede'));
    }

    public function getConstructorProvAction() {
        $model = new InversionesModel();
        echo json_encode(array('data' => 'dededede'));
    }

//    public function exportarPDFAction() {
//        $model = new InversionesReportesModel();
//        echo json_encode(array('data' => 'dededede'));
//    }

    public function guardarPieAction() {
        $model = new InversionesReportesModel();
        $params['pie'] = ($this->_request->getPost('pie')) ? Zend_Json_Decoder::decode($this->_request->getPost('pie')) : array();
        $params['idreporte'] = $this->_request->getPost('idreporte');


        echo json_encode($model->guardarPie($params));
    }

    public function getPieAction() {
        $model = new InversionesReportesModel();
        echo json_encode($model->cargardarPie($this->_request->getPost('idreporte')));
    }

    public function entidadesHijasPlan($identidad) {
        $dominios = $this->integrator->metadatos->DameHijosEstructura($identidad);
        $entidades_hijas = array();
        $entidades_hijas[] = $identidad;
        foreach ($dominios as $entidad_hija) {
            if ($entidad_hija->leaf == 1) {
                $entidades_hijas[] = $entidad_hija->id;
                break;
            } else {
                $entidades_hijas = array_merge($entidades_hijas, self::entidadesHijas($entidad_hija->id));
            }
        }
        return $entidades_hijas;
    }

    public function cargarEntidadesAux($idorganismo) {
        $entidades = array();
        foreach ($idorganismo as $key => $k) {
            $dominios = $this->integrator->metadatos->DameHijosEstructura($k);
            if ($dominios[0] != "") {
                foreach ($dominios as $key => $k) {
                    $entidades_hijas = array();
                    $entidades_hijas = self::entidadesHijas($k->id, $k->text);
                    $entidades = array_merge($entidades_hijas, $entidades);
                }
            }
        }
        return $entidades;
    }

    public function exportarPDFAction() {
        $obj = new GenerarPdfEmisionInversion($parametros);
    }

    function gestionarReportesAction() {
        ini_set("max_execution_time", 1000000);

        $model = new InversionesReportesModel();
        $filtros = json_decode(stripslashes($this->_request->getParam('filtros')));

        $parametros['idejercicio'] = $this->_request->getParam('idejercicio');
        $parametros['idejercicioden'] = $this->_request->getParam('idejercicioden');
        $parametros['aprobadopor'] = $this->_request->getParam('aprobadopor');
        $parametros['elaboradopor'] = $this->_request->getParam('elaboradopor');
        $parametros['observacion'] = $this->_request->getParam('observacion');
        $parametros['integrator'] = $this->integrator;
        //pre_r($parametros);

        $codigo = $this->_request->getParam('codigo');
        $model->exportarReportesPDF($filtros, $parametros, $codigo);
    }

    public function obtenerReporteAction() {
        ini_set("max_execution_time", 6000000);
        ini_set("memory_limit","1024M");
        try {
            $model = new InversionesReportesModel();
            $data = Zend_Json_Decoder::decode($this->_request->getPost('parametros'));
            $data['filtros'] = ($this->_request->getPost('filtros')) ? Zend_Json_Decoder::decode($this->_request->getPost('filtros')) : array();
            $data['monedausd'] = 9900000046;
            $data['monedamp'] = 9900000103;
            
            if(count($data['filtros'][0]['id']) == 0){
                $organismosArray = $model->cargarOrganismosYNombre();
                unset($organismosArray[0]);
                foreach ($organismosArray as $value) {
                    $data['filtros'][0]['id'][] = $value['id'];
                }
            }
            //print_r('ass'); die;
            $result  = $model->getDatosReporte($data);

            $report = $this->pIntegrator->reportes->obtenerReporte($result);
            echo Zend_Json_Encoder::encode(array('html' => $report));

        } catch (Exception $exc) {
            echo Zend_Json::encode(array('success' => false, 'codMsg' => 4, 'mensaje' => $exc->getMessage(), 'detalles' => $exc->getTraceAsString()));
        }
    }
}


