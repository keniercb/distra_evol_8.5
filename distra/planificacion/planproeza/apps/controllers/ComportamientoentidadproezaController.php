<?php

require_once __DIR__ . '/../../planmeta/controllers/ComportamientoentidadController.php';

class ComportamientoentidadproezaController extends ComportamientoentidadController {

    function init() {
        parent::init();
    }

    //Lista todos los comportamientos de las entidades
    public function listarComportamientoAction() {
        try {
            $parametros['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
            $parametros['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
            $parametros['filtros'] = $this->_request->getPost('filtros');
            $parametros['identidad'] = $this->_request->getPost('identidad');
            $dominios = $this->integrator->metadatos->DameHijosEstructura($parametros['identidad']);
            $parametros['dominios'] = $dominios;
            $data = ComportamientoEntidadProezaModel::listarComportamiento($parametros);            
            echo json_encode(array('data' => $data, 'total' => $data[0]['total']));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function guardarComportamientoAction() {
        try {
            $params['datos'] = json_decode(stripslashes($this->_request->getPost('datos')));
            
            $result = ComportamientoEntidadProezaModel::guardarComportamiento($params);
            if ($result == 0) {
                $dat->codMsgE = 1;
            } else {
                $dat->codMsgE = 2;
            }
            echo json_encode($dat);
        } catch (Exception $exc) {
            echo json_encode($exc->getMessage());
        }
    }

}
