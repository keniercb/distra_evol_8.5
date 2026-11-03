<?php

class MonitoreoController extends ZendExt_Controller_Secure
{

    private $_avisoModel;
    private $_monitoreoModel;

    public function init()
    {
        parent:: init();
        $this->view->dirEtiquetas
            = '../../views/idioma/' . $this->global->Perfil->idioma
            . '/monitoreo/monitoreo.js';
//        $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->_avisoModel = new DatAvisoModel();
        $this->_monitoreoModel = new MonitoreoModel();
    }

    public function monitoreoAction()
    {
        $this->render();
    }

    public function listareventosdespachadosAction()
    {
        $params = array();
        if (isset($this->_request->sort)) {
            $params['sort'] = array('field' => $this->_request->sort,
                                    'dir'   => $this->_request->dir);
        }
        $datos = $this->_monitoreoModel->listarEventosDespachados(
            $this->_request->start, $this->_request->limit, $params
        );
        $total = $this->_monitoreoModel->totalEventosDespachados($params);
        echo json_encode(array('datos' => $datos, 'total' => $total));
    }

    public function listaravisosenviadosAction()
    {
        $start = $this->_request->start;
        $limit = $this->_request->limit;
        $idevento = $this->_request->ideventodespachado;
        $filtros = json_decode($this->_request->filtros);
        $datos = $this->_monitoreoModel->listarAvisosEnviados(
            $idevento, $start, $limit, $filtros
        );
        $total = $this->_monitoreoModel->totalAvisosEnviados(
            $idevento, $filtros
        );
        echo json_encode(array('datos' => $datos, 'total' => $total));

    }

    public function listarmensajesenviadosdeavisoAction()
    {
        $ideventodespachado = $this->_request->ideventodespachado;
        $datos
            = $this->_monitoreoModel->
        mostrarMensajesEnviadosPorEventoDespachado(
            $ideventodespachado
        );
        echo json_encode(array('datos' => $datos));
    }

    public function listardestinatariosdemensajeAction()
    {
        $idtask = $this->_request->idtarea;
        $via = $this->_request->via;
        $datos = $this->_monitoreoModel->listarDestinatariosPorMensaje(
            $idtask, $via, $this->_request->start, $this->_request->limit
        );
        $total = $this->_monitoreoModel->totalListarDestinatariosPorMensaje(
            $idtask, $via
        );
        echo json_encode(array('datos' => $datos, 'total' => $total));
    }

    public function checkconnectionAction()
    {
        $_telematicInstance = TelematicClientModel:: getInstance();
        $_success = array(
            'success' => false
        );
        if ($_telematicInstance->isConnected()) {
            $_success = array(
                'success' => true
            );
        }
        echo json_encode($_success);
        exit;
    }

}
