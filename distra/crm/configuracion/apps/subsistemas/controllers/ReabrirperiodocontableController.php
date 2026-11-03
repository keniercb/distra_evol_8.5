<?php

class ReabrirperiodocontableController extends ZendExt_Controller_Secure {

    private $model;

    function init() {
        $this->model = new ReabrirperiodocontableModel();
        parent::init();
    }

    public function reabrirperiodocontableAction() {
        $this->render();
    }

    function cargarEjerciciosContablesAction() {
        $result = $this->model->cargarEjerciciosContables();
        echo(json_encode($result));
    }

    function cargarPeriodosContablesAction() {
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $result = $this->model->cargarPeriodosContables($params);
        echo(json_encode($result));
    }
    
    function cargarSubsistemasAction() {
        $result = $this->model->cargarSubsistemas($params);
        echo(json_encode($result));
    }
    
    function cargarEstructurasAction() {
        $result = $this->model->cargarEstructuras($params);
        echo(json_encode($result));
    }

    function listarSolicitudesAction() {
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['filtros'] = $this->_request->getPost('filtros');
        $data = $this->model->listarSolicitudes($params);
        echo json_encode(array("data" => $data, 'total' => $data[0]['total']));
    }

    function aprobarSolicitudAction() {
        $params['observacion'] = $this->_request->getPost('observacion');
        $params['idperiodoabierto'] = $this->_request->getPost('idperiodoabierto');
        $params['idsubsistema'] = $this->_request->getPost('idsubsistema');
        $params['subsistema'] = $this->_request->getPost('subsistema');
        $params['accion'] = $this->_request->getPost('accion');

        $result = $this->model->aprobarSolicitud($params);
        echo(json_encode($result));
    }

    function exportarSolicitudesAction() {
        try {
            $params['idejercicio'] = $this->_request->getParam('idejercicio');
            $params['denoejercicio'] = $this->_request->getParam('denoejercicio');

            $result = $this->model->exportarSolicitudes($params);
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    function exportarOperacionesAction() {
        try {
            $params['idejercicio'] = $this->_request->getParam('idejercicio');
            $params['denoejercicio'] = $this->_request->getParam('denoejercicio');
//            $params['idperiodoabierto'] = $this->_request->getParam('idperiodoabierto');
//            $params['periodoabierto'] = $this->_request->getParam('periodoabierto');
            $params['periodoabierto'] = json_decode(stripslashes($this->_request->getParam('periodoabierto')));
            ;

            $result = $this->model->exportarOperaciones($params);
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

}
