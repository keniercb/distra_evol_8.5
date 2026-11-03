<?php

/**
 * Created by JetBrains PhpStorm.
 * User: yosniel
 * Date: 6/03/16
 * Time: 9:23
 */
class GestdesagregctrlinversionController extends ZendExt_Controller_Secure {

    public function init() {
        // $this->_meta = ZendExt_Metadata::getInstance();
        parent::init();
    }

    public function gestdesagregctrlinversionAction() {
        $jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->jsayuda = $jsayuda;
        $this->render();
    }

    //Carga los ejercicios del sistema
    public function listarEjerciciosAction() {
        $data->data = NomEjercicioplanificacion::listarEjercicioActualByUri();
        $data->idejercicioactual = NomEjercicioplanificacion::obtenerDenEjercicioActual();
        echo json_encode($data);
    }

    public function cargarTreeNomencladoresAction() {
        $node = $this->_request->getPost('node');
        $valor = $this->_request->getPost('valor');
        $modelInversiones = new InversionesModel();
        echo json_encode($modelInversiones->cargarEntidades($node, $valor));
    }

    public function getInversionesAction() {
        $params = $this->_request->getPost();
        $modelInversiones = new InversionesModel();
        echo json_encode($modelInversiones->cargarInversiones($params, array($this->_request->getPost('identidad')), json_decode(stripslashes($this->_request->getPost('idinversion')))));
    }

    public function getPlanAprobadoAction() {
        $modelDesgCtrl = new DesagregCtrlInverModel();
        echo json_encode($modelDesgCtrl->getPlanAprobadoIver($this->_request->getPost()));
    }

    public function getDesagregacionIAction() {
        $modelDesgCtrl = new DesagregCtrlInverModel();
        echo json_encode($modelDesgCtrl->getDesagI($this->_request->getPost()));
    }

    public function getPlanAprobadoEquipoAction() {
        $modelEquipo = new DatEtapaEquipoModel();
        echo json_encode($modelEquipo->CargarEquiposDesglose($this->_request->getPost()));
    }

    public function getDesagregacionEquipoAction() {
        $modelDesgCtrl = new DesagregCtrlInverModel();
        echo json_encode($modelDesgCtrl->getDesagEquipos($this->_request->getPost(), json_decode(stripslashes($this->_request->getPost('trimestre')))));
    }

    public function getCompTotalEquipoAction() {
        $modelDesgCtrl = new DesagregCtrlInverModel();
        echo json_encode($modelDesgCtrl->getComprobacionEquipos($this->_request->getPost()));
    }

    public function getCompTotalInvAction() {
        $modelDesgCtrl = new DesagregCtrlInverModel();
        echo json_encode($modelDesgCtrl->getComprobacionInver($this->_request->getPost()));
    }

    public function getCmpInversionAction() {
        $modelDesgCtrl = new DesagregCtrlInverModel();
        echo json_encode($modelDesgCtrl->getCmpIver(json_decode(stripslashes($this->_request->getPost('idinvers')))));
    }

    public function saveDesagregacionAction() {
        $modelDesgCtrl = new DesagregCtrlInverModel();
        try {
            echo json_encode($modelDesgCtrl->savedesagregacion(json_decode(stripslashes($this->_request->getPost('datadesglose'))), $this->_request->getPost()));
        } catch (Exception $exc) {
            echo $exc->getMessage();
            die;
        }
    }

    public function saveControlAction() {
        $modelDesgCtrl = new DesagregCtrlInverModel();
        echo json_encode($modelDesgCtrl->saveControl(json_decode(stripslashes(
            $this->_request->getPost('datadesglose'))), $this->_request->getPost()));
    }

    public function getEntidadModeloAction() {
        $modelDesgCtrl = new DesagregCtrlInverModel();
        echo json_encode($modelDesgCtrl->getEntidadModelo($this->_request->getPost()));
    }

    public function getMonedaEntidadAction() {
        $modelDesgCtrl = new DesagregCtrlInverModel();
        echo json_encode($modelDesgCtrl->getMonedaEntidad($this->_request->getPost()));
    }

    public function getPlanMAAction() {
        $modelDesgCtrl = new DesagregCtrlInverModel();
        echo json_encode($modelDesgCtrl->getPlanMA($this->_request->getPost()));
    }

    public function getComprobacionMAAction() {
        $modelDesgCtrl = new DesagregCtrlInverModel();
        echo json_encode($modelDesgCtrl->getComprobacionMA($this->_request->getPost()));
    }

    public function getColumMAAction() {
        $modelDesgCtrl = new DesagregCtrlInverModel();
        echo json_encode($modelDesgCtrl->getColumnasMA($this->_request->getPost()));
    }

    public function getDesagMAAction() {
        $modelDesgCtrl = new DesagregCtrlInverModel();
        echo json_encode($modelDesgCtrl->getDesagregacionMA($this->_request->getPost()));
    }

    public function getRealEjecItrimestreAction() {
        $modelDesgCtrl = new DesagregCtrlInverModel();
        echo json_encode($modelDesgCtrl->getCtrl($this->_request->getPost()));
    }

    public function getRealEjecMAAction() {
        $modelDesgCtrl = new DesagregCtrlInverModel();
        echo json_encode($modelDesgCtrl->getCtrlMA($this->_request->getPost()));
    }

    public function getDesagregacionIsemestreAction() {
        $modelDesgCtrl = new DesagregCtrlInverModel();
        echo json_encode($modelDesgCtrl->getDesagIsemestre(json_decode(stripslashes($this->_request->getPost('semestre'))), $this->_request->getPost()));
    }

    public function getDesagregacionIsemestreMAAction() {
        $modelDesgCtrl = new DesagregCtrlInverModel();
        echo json_encode($modelDesgCtrl->getDesagIsemestreMA(json_decode(stripslashes($this->_request->getPost('semestre'))), $this->_request->getPost()));
    }

    public function getEstimadoEjecAction() {
        $modelDesgCtrl = new DesagregCtrlInverModel();
        echo json_encode($modelDesgCtrl->getCtrl($this->_request->getPost()));
    }

	public function limpiarDesagregacionAction(){
		$modelDesgCtrl = new DesagregCtrlInverModel();
        try {
            echo json_encode($modelDesgCtrl->cleanDesagregacion(json_decode(stripslashes($this->_request->getPost('idinversion'))), $this->_request->getPost()));
        } catch (Exception $exc) {
            echo $exc->getMessage();
            die;
        }
	}
}
