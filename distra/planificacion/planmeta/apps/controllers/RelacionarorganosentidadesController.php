<?php

class RelacionarorganosentidadesController extends ZendExt_Controller_Secure {

    /**
     * init
     * Inicializar el componente
     * */
    public function init() {
        parent::init();
    }

    public function relacionarorganosentidadesAction() {
        //$jsayuda = $this->integrator->ayuda->devolverJS();
        //$this->view->jsayuda = $jsayuda;
        $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->jsestructura = $jsestructura;
        $this->render();
    }

    public function listarOrganosRelacionadosAction() {
        $params['identidad'] = $this->_request->getPost('identidad');
//        $params['filtros'] = $this->_request->getPost('filtros');
//        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
//        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;

        $data = RelacionarorganosentidadesModel::listarOrganosRelacionados($params);
        echo json_encode(array('data' => $data, 'total' => $data[0]['total']));
    }

    public function listarOrganosAddAction() {
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['filtros'] = $this->_request->getPost('filtros');
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;

        $data = RelacionarorganosentidadesModel::listarOrganosAdd($params);
        echo json_encode(array('data' => $data, 'total' => $data[0]['total']));
    }

    public function adicionarOrganosAction() {
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['organos'] = json_decode(stripslashes($this->_request->getPost('organos')));

        $adicionados = 0;
        if ($params['organos'][0]->organo->idorganosatisface != null) {
            $adicionados = RelacionarorganosentidadesModel::adicionarOrganos($params);
        }
        echo json_encode(array('codMsgN' => $adicionados));
    }

    public function eliminarOrganosAction() {
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['organos'] = json_decode(stripslashes($this->_request->getPost('organos')));

        $eliminados = 0;
        if ($params['organos'][0]->organo->idorganosatisfaceentidad != null) {
            $eliminados = RelacionarorganosentidadesModel::eliminarOrganos($params);
        }
        echo json_encode(array('codMsgN' => $eliminados));
    }

    public function actualizarPrioridadAction() {
        $params['arrayprioridad'] = json_decode(stripslashes($this->_request->getPost('organos_prioridad')));
        $params['identidad'] = $this->_request->getPost('identidad');
        $data = RelacionarorganosentidadesModel::actualizarPrioridad($params);

        if ($data == 1) {
            $dat->codMsg = 21;
        } elseif ($data == 2) {
            $dat->codMsg = 22;
        } else {
            $dat->codMsg = 3;
        }
        echo json_encode($dat);
    }

}
