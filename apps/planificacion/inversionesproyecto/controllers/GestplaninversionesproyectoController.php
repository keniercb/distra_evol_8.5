<?php

require_once __DIR__ . '/../../inversiones/controllers/GestplaninversionesController.php';

class GestplaninversionesproyectoController extends GestplaninversionesController {


    public function init() {
        parent::init();
    }

    public function gestplaninversionesproyectoAction() {
        $this->view->sipac_elementos = $this->integrator->planpdo->getJSElementos();
        $this->view->jsrepresentacion = $this->integrator->gis->DevolverJS();

        $this->render();
    }

    //*** listar desglose Niveles de actividad para plataforma integrada ****
    function cargarInvCapExplotacionAction() {
        $datosInv['idinversion'] = $this->_request->getPost('idinversion');
        $datosInv['idetapainversion'] = $this->_request->getPost('idetapainversion');
        $datosInv['idejercicio'] = $this->_request->getPost('idejercicio');
        $datosInv['identidad'] = $this->_request->getPost('identidad');
        $datosInv['aaejercicio'] = $this->_request->getPost('aaejercicio'); //denominacion del ejercicio antes del anterior
        $datosInv['aejercicio'] = $this->_request->getPost('aejercicio'); //denominacion del ejercicio anterior
        $datosInv['pejercicio'] = $this->_request->getPost('pejercicio'); //denominacion del ejercicio porsterior
        $datosInv['start'] = 0;
        $datosInv['limit'] = 2000;
        $inv = new DatInversnivelactividadModel();
        $resultado = $inv->listarInvNivelActividadDesglose($datosInv);
        if (count($resultado) > 0) {
            echo json_encode(array('data' => $resultado, 'total' => count($resultado)));
        } else {
            echo json_encode(array('data' => array(), 'total' => 0));
        }
    }

    function guardarNivelesAction() {
        $params['valores'] = json_decode(stripslashes($this->_request->getPost('valores')));
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['idinversion'] = $this->_request->getPost('idinversion');
        $params['aaejercicio'] = $this->_request->getPost('aaejercicio'); //denominacion del ejercicio antes del anterior
        $params['aejercicio'] = $this->_request->getPost('aejercicio'); //denominacion del ejercicio anterior
        $params['pejercicio'] = $this->_request->getPost('pejercicio'); //denominacion del ejercicio porsterior
        $model = new DatInversnivelactividadModel();
        echo json_encode(array('codMsgOI' => $model->guardarNivelesDesglose($params)));
    }



}
