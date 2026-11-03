<?php

class GestionoportunidadController extends ZendExt_Controller_Secure
{
    private $_model;
    private $_clientemodel;

    function init()
    {
        parent::init();
        $this->_model = new OportunidadModel();
        $this->_clientemodel = new ClienteModel();
    }

    function gestionoportunidadAction()
    {
        //$this->render();
    }

    function insertAction()
    {
        $params = $this->_request->getParams();
        $result = $this->_model->insert($params);
        echo json_encode($result);
    }

    function modifyAction()
    {
        $params = $this->_request->getParams();
        $result = $this->_model->insert($params);
        echo json_encode($result);
    }

    function deleteAction()
    {
        $params = $this->_request->getParams();
        $params = json_decode($params['arrayDel']);
        $result = $this->_model->delete($params);
        echo json_encode($result);
    }

    function getOportunidadAction()
    {
        $params = $this->_request->getParams();
        $result = $this->_model->getOportunidad($params);
        echo json_encode(array('data' => $result['data'], 'total' => $result['count'], 'success' => true));
    }

    function getPrioridadAction()
    {
        $params = $this->_request->getParams();
        $result = $this->_model->getPrioridad($params);
        echo json_encode(array('data' => $result['data'], 'total' => $result['count'], 'success' => true));
    }

    function getTipoAction()
    {
        $params = $this->_request->getParams();
        $result = $this->_model->getTipo($params);
        echo json_encode(array('data' => $result['data'], 'total' => $result['count'], 'success' => true));
    }

    function getCampannaAsociadaAction()
    {
        $params = $this->_request->getParams();
        $result = $this->_model->getCampannaAsociada($params);
        echo json_encode(array('data' => $result['data'], 'total' => $result['count'], 'success' => true));
    }

    function getCreadoPorAction()
    {
        $params = $this->_request->getParams();
        $result = $this->_model->getCreadoPor($params);
        echo json_encode(array('data' => $result['data'], 'total' => $result['count'], 'success' => true));
    }

    function getCanalAction()
    {
        $params = $this->_request->getParams();
        $result = $this->_model->getCanal($params);
        echo json_encode(array('data' => $result['data'], 'total' => $result['count'], 'success' => true));
    }

    function getClienteAction()
    {
        $params = $this->_request->getParams();
        $result = $this->_model->getCliente($params);
        echo json_encode(array('data' => $result['datos'], 'total' => $result['cantidad'], 'success' => true));
    }

    function getClienteOportunidadAction(){
        $params = $this->_request->getParams();
        $result = $this->_clientemodel->getClientes($params);
        echo json_encode(array('data' => $result['data'], 'total' => $result['total'], 'success' => true));

    }
}
