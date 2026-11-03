<?php

class CarteraproductosController extends ZendExt_Controller_Secure {

    function init() {
        parent::init();
    }

    public function carteraproductosAction() {
        // $jsayuda = $this->integrator->ayuda->devolverJS();
        $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->jsestructura = $jsestructura;
        //$this->view->jsayuda = $jsayuda;
        $this->render();
    }

    public function cargarUnidadMedidaAction() {
        $unidades = $this->integrator->datosmaestros->listarUnidadesMedidaTodas();
        echo json_encode(array('data' => $unidades));
    }

    public function obtenerEntidadesHijasAction() {
        try {
            $identidad = $this->_request->getPost('identidad');
            $entidad = $this->_request->getPost('denomentidad');
            $excluir = array(7, 8, 9, 10);
            $dominios = $this->integrator->metadatos->DameHijosEstructura($identidad, $excluir);
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

    /* Lista todos los productos de la cartera de la entidad */

    public function listarCarteraProductosAction() {
        try {
            $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
            $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
            $params['filtros'] = $this->_request->getPost('filtros');
            $params['identidad'] = $this->_request->getPost('identidad');
            echo json_encode(CarteraproductosModel::listarCarteraProductos($params));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function exportarCarteraProductosAction() {
        try {
            $params['identidad'] = $this->_request->getParam('identidad');
            $params['denoentidad'] = $this->_request->getParam('denoentidad');
            $params['filtros'] = json_decode(stripslashes($this->_request->getParam('filtros')));
            $params['um'] = $this->integrator->datosmaestros->listarUnidadesMedidaTodas();
            CarteraproductosModel::exportarCarteraProductos($params);
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

}
