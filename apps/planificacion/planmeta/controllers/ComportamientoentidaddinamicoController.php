<?php

class ComportamientoentidaddinamicoController extends ZendExt_Controller_Secure {

    function init() {
        parent::init();
    }

    public function comportamientoentidaddinamicoAction() {
        $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->jsestructura = $jsestructura;
        $this->render();
    }

    public function obtenerColumnasDinamicasComportamientoEntidadAction() {
        try {
            $comportamientos = ComportamientoEntidaddinamicoModel::obtenerColumnasDinamicasComportamientoEntidad();
            echo json_encode(array('data' => $comportamientos));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function obtenerEntidadesHijasAction() {
        try {
            $identidad = $this->_request->getPost('identidad');
            $entidad = $this->_request->getPost('denomentidad');
            $entidades = ComportamientoEntidaddinamicoModel::obtenerEntidadesHijas($identidad, $entidad);
            echo json_encode(array('data' => $entidades));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function listarComportamientoAction() {
        try {
            $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
            $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
            $params['columnas'] = json_decode(stripslashes($this->_request->getPost('columnas')));
            $params['filtros'] = $this->_request->getPost('filtros');
            $params['identidad'] = $this->_request->getPost('identidad');
            $excluir = array(7, 8, 9, 10);
            $dominios = $this->integrator->metadatos->DameHijosEstructura($params['identidad'], $excluir);
            $params['dominios'] = $dominios;
            $data = ComportamientoEntidaddinamicoModel::listarComportamiento($params);
            echo json_encode(array('data' => $data, 'total' => $data[0]['total']));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function guardarComportamientoAction() {
        try {
            $params['datos'] = json_decode(stripslashes($this->_request->getPost('datos')));
            $params['columnas'] = json_decode(stripslashes($this->_request->getPost('columnas')));
            $result = ComportamientoEntidaddinamicoModel::guardarComportamiento($params);
            echo json_encode(array('codMsgN' => $result));
        } catch (Exception $exc) {
            json_encode($exc->getMessage());
        }
    }

    public function guardarRectorAction() {
        try {
            $params['identidad'] = $this->_request->getPost('identidad');
            $params['iddatosnomenclador'] = $this->_request->getPost('iddatosnomenclador');
            $result = ComportamientoEntidaddinamicoModel::guardarRector($params);
            echo json_encode(array('codMsgN' => $result));
        } catch (Exception $exc) {
            echo json_encode($exc->getMessage());
        }
    }

}
