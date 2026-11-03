<?php

/**
 * (c) Roberto Yasel Garcia Quintana
 *
 * Clase controladora
 * @copyright UCID Cuba XETID
 * @package herramientasintegracion
 * @subpackage matrizrelaciones
 * @author Roberto Yasel Garcia Quintana
 * @version
 */
class MatrizrelacionesController extends ZendExt_Controller_Secure
{
    private $model;
    private $idproyecto;

    function init()
    {
        parent::init();
        $this->idproyecto = $this->_request->getPost('idproyecto');
        $this->model = new DatEstudiomatrizrelacionModel();
    }

    public function cargarAyudaAction()
    {
        try {
            $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        } catch (Exception $exc) {
            echo Zend_Json::encode(array('success' => false, 'codMsg' => 4, 'mensaje' => $exc->getMessage(), 'detalles' => $exc->getTraceAsString()));
        }
    }

    public function matrizrelacionesAction()
    {
        try {
            $this->view->extensionesPLAN = $this->pIntegrator->integracion->extensionesPLAN();
            $this->view->pyeComun = $this->pIntegrator->integracion->pyeComun();
            $this->view->matrizrelacionesComponent = $this->pIntegrator->integracion->matrizrelacionesComponent();
            $this->view->jsreportes = $this->pIntegrator->reportes->devolverJS();
            $this->render();
        } catch (Exception $exc) {
            echo Zend_Json::encode(array('success' => false, 'codMsg' => 4, 'mensaje' => $exc->getMessage(), 'detalles' => $exc->getTraceAsString()));
        }
    }

    public function loadcolumnsAction()
    {
        try {
            $res = $this->model->getConfig($this->idproyecto);
            echo Zend_Json::encode($res);
        } catch (Exception $exc) {
            echo Zend_Json::encode(array('success' => false, 'codMsg' => 4, 'mensaje' => $exc->getMessage(), 'detalles' => $exc->getTraceAsString()));
        }
    }

    public function loadmatrizAction()
    {
        try {
            $idestudiomatrizrelacion = $this->_request->getPost('idestudiomatrizrelacion');
            $res = $this->model->loadMatrix($idestudiomatrizrelacion);
            echo Zend_Json::encode($res);
        } catch (Exception $exc) {
            echo Zend_Json::encode(array('success' => false, 'codMsg' => 4, 'mensaje' => $exc->getMessage(), 'detalles' => $exc->getTraceAsString()));
        }
    }

    public function getmatrizxproyectoAction()
    {
        $idproyectoplanificacion = $this->_request->getPost('idproyectoplanificacion');
        $denominacion = $this->_request->getPost('denominacion');
        $filas = $this->_request->getPost('filas') ? Zend_Json_Decoder::decode(stripcslashes($this->_request->getPost('filas'))) : array();
        $columnas = $this->_request->getPost('columnas') ? Zend_Json_Decoder::decode(stripcslashes($this->_request->getPost('columnas'))) : array();
        $datos = $this->_request->getPost('datos') ? Zend_Json_Decoder::decode(stripcslashes($this->_request->getPost('datos'))) : array();
        $this->pIntegrator->integracion->getMatrizXproyecto($idproyectoplanificacion, $denominacion, $columnas, $filas, $datos, 'Matrizrecursos');
    }

    public function getmatrizhibridaAction()
    {
        $idproyectoplanificacion = $this->_request->getPost('idproyectoplanificacion');
        $denominacion = $this->_request->getPost('denominacion');
        $filas = $this->_request->getPost('filas') ? Zend_Json_Decoder::decode(stripcslashes($this->_request->getPost('filas'))) : array();
        $columnas = $this->_request->getPost('columnas') ? Zend_Json_Decoder::decode(stripcslashes($this->_request->getPost('columnas'))) : array();
        $datos = $this->_request->getPost('datos') ? Zend_Json_Decoder::decode(stripcslashes($this->_request->getPost('datos'))) : array();
        $this->pIntegrator->integracion->getMatrizXproyecto($idproyectoplanificacion, $denominacion, $columnas, $filas, $datos, 'Matrizhibrida');
    }
    public function getmatrizhibridatareasAction()
    {
        $idproyectoplanificacion = $this->_request->getPost('idproyectoplanificacion');
        $denominacion = $this->_request->getPost('denominacion');
        $filas = $this->_request->getPost('filas') ? Zend_Json_Decoder::decode(stripcslashes($this->_request->getPost('filas'))) : array();
        $columnas = $this->_request->getPost('columnas') ? Zend_Json_Decoder::decode(stripcslashes($this->_request->getPost('columnas'))) : array();
        $datos = $this->_request->getPost('datos') ? Zend_Json_Decoder::decode(stripcslashes($this->_request->getPost('datos'))) : array();
        $this->pIntegrator->integracion->getMatrizXproyecto($idproyectoplanificacion, $denominacion, $columnas, $filas, $datos, 'Matrizhibridaportareas');
    }

    public function getmatriztiempoAction()
    {
        $idproyectoplanificacion = $this->_request->getPost('idproyectoplanificacion');
        $denominacion = $this->_request->getPost('denominacion');
        $filas = $this->_request->getPost('filas') ? Zend_Json_Decoder::decode(stripcslashes($this->_request->getPost('filas'))) : array();
        $columnas = $this->_request->getPost('columnas') ? Zend_Json_Decoder::decode(stripcslashes($this->_request->getPost('columnas'))) : array();
        $datos = $this->_request->getPost('datos') ? Zend_Json_Decoder::decode(stripcslashes($this->_request->getPost('datos'))) : array();
        $this->pIntegrator->integracion->getMatrizXproyecto($idproyectoplanificacion, $denominacion, $columnas, $filas, $datos, 'Matrizdetiempo');
    }

    public function saveconfigAction()
    {
        try {
            $config = $this->_request->getPost('config') ? Zend_Json_Decoder::decode(stripcslashes($this->_request->getPost('config'))) : array();
            $res = $this->model->saveConfig($config);
            echo Zend_Json::encode($res);
        } catch (Exception $exc) {
            echo Zend_Json::encode(array('success' => false, 'codMsg' => 4, 'mensaje' => $exc->getMessage(), 'detalles' => $exc->getTraceAsString()));
        }
    }

    public function insertrolumnrowAction()
    {
        try {
            $params = $this->_request->getPost('params') ? Zend_Json_Decoder::decode(stripcslashes($this->_request->getPost('params'))) : array();
            $res = $this->model->insertColumnRow($params);
            echo Zend_Json::encode($res);
        } catch (Exception $exc) {
            echo Zend_Json::encode(array('success' => false, 'codMsg' => 4, 'mensaje' => $exc->getMessage(), 'detalles' => $exc->getTraceAsString()));
        }
    }

    public function creatematrixAction()
    {
        try {
            $config = $this->_request->getPost('config') ? Zend_Json_Decoder::decode(stripcslashes($this->_request->getPost('config'))) : array();
            $columnrows = $this->_request->getPost('columnrows') ? Zend_Json_Decoder::decode(stripcslashes($this->_request->getPost('columnrows'))) : array();
            $datos = $this->_request->getPost('datos') ? Zend_Json_Decoder::decode(stripcslashes($this->_request->getPost('datos'))) : array();
            $res = $this->model->creatematrix($config, $columnrows, $datos);
            echo Zend_Json::encode($res);
        } catch (Exception $exc) {
            echo Zend_Json::encode(array('success' => false, 'codMsg' => 4, 'mensaje' => $exc->getMessage(), 'detalles' => $exc->getTraceAsString()));
        }
    }

    public function deletecolumnrowAction()
    {
        try {
            $params = $this->_request->getPost('params') ? Zend_Json_Decoder::decode(stripcslashes($this->_request->getPost('params'))) : array();
            $res = $this->model->deleteColumnRow($params);
            echo Zend_Json::encode($res);
        } catch (Exception $exc) {
            echo Zend_Json::encode(array('success' => false, 'codMsg' => 4, 'mensaje' => $exc->getMessage(), 'detalles' => $exc->getTraceAsString()));
        }
    }

    public function updatecolumnrowAction()
    {
        try {
            $params = $this->_request->getPost('params') ? Zend_Json_Decoder::decode(stripcslashes($this->_request->getPost('params'))) : array();
            $res = $this->model->updateColumnRow($params);
            echo Zend_Json::encode($res);
        } catch (Exception $exc) {
            echo Zend_Json::encode(array('success' => false, 'codMsg' => 4, 'mensaje' => $exc->getMessage(), 'detalles' => $exc->getTraceAsString()));
        }
    }

    public function saveCellsAction()
    {
        try {
            $params = $this->_request->getPost('params') ? Zend_Json_Decoder::decode(stripcslashes($this->_request->getPost('params'))) : array();
            $res = $this->model->saveCells($params);
            echo Zend_Json::encode($res);
        } catch (Exception $exc) {
            echo Zend_Json::encode(array('success' => false, 'codMsg' => 4, 'mensaje' => $exc->getMessage(), 'detalles' => $exc->getTraceAsString()));
        }
    }

    public function exportAction()
    {
        try {
//            $filename = $this->_request->getPost('filename') ? $this->_request->getPost('filename') : "newFile";
            $html = $this->_request->getPost('table');
            $type = $this->_request->getPost('type') ? $this->_request->getPost('type') : "pdf";
            $dow = $this->_request->getPost('download');
            if ($dow === 'false') {
                session_start();
//                $_SESSION['filename'] = $filename;
                $_SESSION['html'] = $html;
                $_SESSION['type'] = $type;
            } else {
                $res = $this->model->export($_SESSION['html'], $_SESSION['type']);
            }
//            echo Zend_Json::encode($res);
        } catch (Exception $exc) {
            echo Zend_Json::encode(array('success' => false, 'codMsg' => 4, 'mensaje' => $exc->getMessage(), 'detalles' => $exc->getTraceAsString()));
        }
    }

    public function obtenerReporteAction()
    {
        ini_set("max_execution_time", 6000000);
        ini_set("memory_limit", "1024M");
        try {
            $data = Zend_Json_Decoder::decode($this->_request->getPost('parametros'));
            $result = $this->model->getDatosReporte($data);

            $report = $this->pIntegrator->reportes->obtenerReporte($result);
            echo Zend_Json_Encoder::encode(array('html' => $report));

        } catch (Exception $exc) {
            echo Zend_Json::encode(array('success' => false, 'codMsg' => 4, 'mensaje' => $exc->getMessage(), 'detalles' => $exc->getTraceAsString()));
        }
    }
}