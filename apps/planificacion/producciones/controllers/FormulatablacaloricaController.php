<?php

class FormulatablacaloricaController extends ZendExt_Controller_Secure {

    function init() {
        parent::init();
        $this->model = new DatTablacaloricaModel();
    }

    public function formulatablacaloricaAction() {
        $this->render();
    }

    public function listarTablaCaloricaAction() {
        $params = array();
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $params['filtros'] = $this->_request->getPost('filtros');
        $data = $this->model->listarTablacalorica($params);
        echo json_encode(array('data' => $data, 'total' => $data[0]['total']));
    }

    public function listarIndicadoresAddTablaCaloricaAction() {
        $params = array();
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $params['filtros'] = $this->_request->getPost('filtros');
        $data = $this->model->listarIndicadoresAddTablaCalorica($params);
        echo json_encode(array('data' => $data, 'total' => $data[0]['total']));
    }

    public function adicionarIndicadoresTablaCaloricaAction() {
        $indicadores = json_decode(stripslashes($this->_request->getPost('indicadores')));
        $actualizados = array();
        if ($indicadores[0]->indicador->idindicador != null) {
            $actualizados = $this->model->adicionarIndicadoresTablaCalorica($indicadores);
        }
        echo json_encode(array('codMsgN' => 1, 'indicadores' => $actualizados));
    }

    public function eliminarIndicadoresTablaCaloricaAction() {
        $indicadores = json_decode(stripslashes($this->_request->getPost('indicadores')));
        $eliminados = array();
        if ($indicadores[0]->idtablacalorica != null) {
            $eliminados = $this->model->eliminarIndicadoresTablaCalorica($indicadores);
        }
        echo json_encode(array('codMsgN' => 1, 'indicadores' => $eliminados));
    }

    public function actualizarIndicadoresTablaCaloricaAction() {
        $params['indicadores'] = json_decode(stripslashes($this->_request->getPost('indicadores')));
        $params['activar'] = $this->_request->getPost('activar');
        $params['idusuario'] = $this->global->Perfil->idusuario;
        $actualizados = array();
        if ($params['indicadores'][0]->indicador->idtablacalorica != null) {
            $actualizados = $this->model->actualizarIndicadoresTablaCalorica($params);
        }
        echo json_encode(array('codMsgN' => 1, 'indicadores' => $actualizados));
    }

    public function listarFormulasRelacionadasAction() {
        $params = array();
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $params['filtros'] = $this->_request->getPost('filtros');
        $params['idtablacalorica'] = $this->_request->getPost('idtablacalorica');
        $data = array();
        if ($params['idtablacalorica'] != null) {
            $data = $this->model->listarFormulasRelacionadas($params);
        }
        echo json_encode(array('data' => $data, 'total' => $data[0]['total']));
    }

    public function listarIndicadorEnLaFormulaAction() {
        $params = array();
        $params['idtablacalorica'] = $this->_request->getPost('idtablacalorica');
        $params['idformula'] = $this->_request->getPost('idformula');
        $data = array();
        if ($params['idtablacalorica'] != null && $params['idformula'] != null) {
            $data = $this->model->listarIndicadorEnLaFormula($params);
        }
        echo json_encode(array('data' => $data, 'total' => $data[0]['total']));
    }

    public function exportarIndicadoresTablaCaloricaAction() {
        $params = array();
        $params['filtros'] = json_decode(stripslashes($this->_request->getParam('filtros')));
        ini_set("max_execution_time", 600); //setear el tiempo de ejecucion a 10min
        $this->model->exportarAExcel($params);
    }

}
