<?php

class ComportamientoentidadController extends ZendExt_Controller_Secure {

    function init() {
        parent::init();
    }

    public function comportamientoentidadAction() {
        //$jsayuda = $this->integrator->ayuda->devolverJS();
        $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->jsestructura = $jsestructura;
        $this->view->jsayuda = $jsayuda;
        $this->render();
    }

    public function obtenerEntidadesHijasAction() {
        try {
            $identidad = $this->_request->getPost('identidad');
            $entidad = $this->_request->getPost('denomentidad');
            $excluir = array(7,8,9,10);
            $dominios = $this->integrator->metadatos->DameHijosEstructura($identidad,$excluir );
            $entidades = array();
            foreach ($dominios as $key => $value) {
                $entidades[$key][identidad] = $value->id;
                $entidades[$key][denominacion] = $value->denominacion;
            }
            $arrayentidad['identidad'] = $identidad;
            $arrayentidad['denominacion'] = $entidad;
            array_unshift($entidades, $arrayentidad);
            echo json_encode(array('data' => $entidades));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    /* Lista todos los comportamientos de las entidades */

    public function listarComportamientoAction() {
        try {
            $parametros['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
            $parametros['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
            $parametros['filtros'] = $this->_request->getPost('filtros');
            $parametros['identidad'] = $this->_request->getPost('identidad');
            $excluir = array(7, 8, 9, 10);
            $dominios = $this->integrator->metadatos->DameHijosEstructura($parametros['identidad'], $excluir);
            $parametros['dominios'] = $dominios;
            $data = ComportamientoEntidadModel::listarComportamiento($parametros);
            echo json_encode(array('data' => $data, 'total' => $data[0]['total']));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function guardarComportamientoAction() {
        try {
            $params['datos'] = json_decode(stripslashes($this->_request->getPost('datos')));
            $result = ComportamientoEntidadModel::guardarComportamiento($params);
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

    public function guardarRectorAction() {
        try {
            $identidad = json_decode(stripslashes($this->_request->getPost('identidad')));
            $result = ComportamientoEntidadModel::guardarRector($identidad);
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
