<?php

$dirwww = str_ireplace('web', 'lib', $_SERVER['DOCUMENT_ROOT']);
include_once($dirwww . '/Adapters/PHPExcel/1.8.0/PHPExcel.php');
include_once($dirwww . '/Adapters/PHPExcel/1.8.0/PHPExcel/Reader/Excel2007.php');
include_once($dirwww . '/Adapters/PHPExcel/1.8.0/PHPExcel/Reader/Excel5.php');
include_once($dirwww . '/Adapters/PHPExcel/1.8.0/PHPExcel/Reader/CSV.php');
include_once($dirwww . '/Adapters/PHPExcel/1.8.0/PHPExcel/Reader/Excel2003XML.php');
include_once($dirwww . '/Adapters/PHPExcel/1.8.0/PHPExcel/Reader/OOCalc.php');
include_once($dirwww . '/Adapters/PHPExcel/1.8.0/PHPExcel/Reader/SYLK.php');
include_once($dirwww . '/Adapters/PHPExcel/1.8.0/PHPExcel/Reader/Gnumeric.php');
include_once($dirwww . '/Adapters/PHPExcel/1.8.0/PHPExcel/IOFactory.php');

/**
 * @author Jorge Luis Cuellar Mondeja
 * @date   : 23/11/2012
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class GestregistrodepreciacionController extends BaseController
{

    private $_model;

    /**
     *
     */
    public function init()
    {
        parent:: init('log.aft.registrodepreiacion');
        //$this->regoperativoModel = new GestregoperativoModel();
        $this->_model = new RegistroDepreciacionModel();
        $cFechaContable = 'FechaContable';
        $fecha = $this->global->$cFechaContable->fecha;
        $this->view->uiVariables = array_merge(
            array(
                'fechacontable' => json_encode($fecha)), $this->view->uiVariables
        );
    }

    /**
     * Funcionalidad para renderizar la IU.
     */
    public function gestregistrodepreciacionAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.aft.registrodepresiacion');
        $this->renderTemplate();
        // $this->render();
    }

    /**
     * Carga los datos del excel.
     */
    public function importarDatosAction()
    {
        $dirfile = $_FILES['fileUpload']['tmp_name'];

        if (file_exists($dirfile)) {
            $response = $this->_model->excelImportToArray($dirfile);
            if($response == false){
                $this->success = false;
                $this->codMsg = 3;
                return;
            }
            $this->_model->importarKilometrajePorChapaIndicativo($response);


            $this->success = true;
            $this->total = count($response[0]);
            $this->datos = $response[0];
            $this->arrayfila = $response[1][0];
            $this->fechaexcel = $response[0][0]['fecha'];
        }
    }

    /**
     * Inserta los datos del excel concatenados con los del sistema
     * en el historial.
     */
    public function insercionDatosAction(){
        // $datos = json_decode($this->_request->getPost('valor'));
        $datos->idregnumerico = json_decode($this->_request->getPost('valor'));
        $datos->recursoconsumido = json_decode($this->_request->getPost('recursoconsumido'));
        $data = $this->_model->llenarHistorial($datos);
        $this->datos = $data;
        //echo json_encode($data);
    }

    /**
     * Concatena los datos del excel con los del sistema.
     */
    public function concatenarDatosExcelAction()
    {
        try {
            $parametros = new stdClass();
            $parametros->cmbSistema = $this->_request->getPost('cmbSistema');
            $parametros->cmbPrimerFichero = $this->_request->getPost('cmbPrimerFichero');
            $parametros->cmbSegundoFichero = $this->_request->getPost('cmbSegundoFichero');
            $parametros->primerfichero = json_decode(stripcslashes($this->_request->getPost('primerfichero')));
            $parametros->segundofichero = json_decode(stripcslashes($this->_request->getPost('segundofichero')));
            $parametros->fecha = $this->_request->getPost('fecha');
            $parametros->plugins = $this->_request->getPost('plugins');

            $data = $this->_model->concatenarDatos($parametros);
            $this->total = count($data[2]);
            $this->data = (count(array_slice($data[2], 0)) > 0) ? array_slice($data[2], 0): null;
            $this->name = $this->_request->getPost('cmbDenomSistema');
            $this->dataIndex = $data[1];
            $this->insertar = $data[0];//$this->_model->getExcelSistemaUpdate($data[0]);// $data[0];
            /* echo json_encode(
              array('total'     => count($data[3]),
              'data'      => array_slice($data[3], 0),
              'name'      => $data[1],
              'dataIndex' => $data[2],
              'mostrar'   => $data[0])
              ); */
        } catch (Exception $exc) {
            $this->importa = 'no';
            // echo json_encode(array('importa' => 'no'));
        }
    }

    /**
     * Carga los datos del grid central.
     */
    public function cargarGridCentralAction()
    {
        $parametros = $this->uiParams;
        
        /*ComunAFTModel::getInstance()->configStartAndLimitInParams(
            $parametros, $this->_request->getPost('start'), $this->_request->getPost('limit')
        );*/
        $parametros['idestructura'] = $this->global->Estructura->idestructura;
        $datosGrid = $this->_model->getDatosGridCentral($parametros);
        $this->total = $datosGrid['total'];
        $this->cantidad = $datosGrid['total'];
        $this->datos = $datosGrid['datos'];

        // echo json_encode($this->model->getDatosGridCentral($parametros));
    }

    /**
     * Elimina los datos del historial mediante una fecha seleccionada por el usuario.
     */
    public function eliminarDatosAction()
    {
        try {
            $var = json_decode($this->_request->getPost('name'));

            if ($this->uiParams['vista'] == 2) {
                $datoseliminar = json_decode(stripcslashes($this->_request->getPost('datoseliminar')));
                $this->_model->eliminarDatHistorial($datoseliminar, $this->uiParams['vista']);
                $this->msg = 1;
            } else {
                if ($var == 'buscarfecha') {
                    $data = $this->_model->getDatHistorial();
                    $this->total = count($data);
                    $this->data = $data;
                    $this->msg = 1;
                } else {
                    $datoseliminar = json_decode(stripcslashes($this->_request->getPost('datoseliminar')));
                    $this->_model->eliminarDatHistorial($datoseliminar);
                    $this->msg = 1;
                }
            }

        } catch (Exception $exc) {
            $this->msg = 3;
            $this->error = $exc->getMessage();
        }
    }

    public  function cargarCamposIdentificadoresAction()
    {
        $this->datos = $this->_model->cargarCamposIdentificadores();
    }

    public function guardarDatosAction()
    {
        //$datosrecurso = Zend_Json::decode(stripcslashes($this->uiParams['arrayrecurso']));
        $datosrecurso->insertar = json_decode(stripcslashes($this->uiParams['arrayrecurso']));
        $result = $this->_model->guardarDatos($datosrecurso);
        $this->msg = $result;
    }
    public function insertarRegNumInicialesAction()
    {
        //$this->_model->insertarRegNumInicial();
        $this->msg = 1;
    }

}
