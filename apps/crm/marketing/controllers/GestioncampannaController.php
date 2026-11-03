<?php

class GestioncampannaController extends ZendExt_Controller_Secure
{
    private $_model;
    private $_actmodel;
    private $_clientemodel;
    private $_productomodel;

    function init()
    {
        parent::init();
        $this->_model = new CampannaModel();
        $this->_actmodel = new ActividadModel();
        $this->_clientemodel = new ClienteModel();
        $this->_productomodel = new ProductoModel();
    }

    function gestioncampannaAction()
    {
//        $this->render();
    }

    function insertAction()
    {
        $params = $this->_request->getParams();
        $result = $this->_model->insert($params);
        echo json_encode($result);
    }

    function campmodifyAction()
    {
        $params = $this->_request->getParams();
        $result = $this->_model->insert($params);
        echo json_encode($result);
    }

    function campdeleteAction()
    {
        $params = $this->_request->getParams();
        $params = json_decode($params['arrayDel']);
        $result = $this->_model->campdelete($params);
        echo json_encode($result);
    }

    function getCampannaAction()
    {
        $params = $this->_request->getParams();
        $result = $this->_model->getCampanna($params);
        echo json_encode(
            array('data' => $result['data'], 'total' => $result['count'],
                'success' => true)
        );
    }

    function getPrioridadAction()
    {
        $params = $this->_request->getParams();
        $result = $this->_model->getPrioridad($params);
        echo json_encode(
            array('data'    => $result['data'], 'total' => $result['count'],
                  'success' => true)
        );
    }

    function getCanalAction()
    {
        $params = $this->_request->getParams();
        $result = $this->_model->getCanal($params);
        echo json_encode(array('data' => $result['data'], 'total' => $result['count'], 'success' => true));
    }

    function getActividadAction()
    {
        $params = $this->_request->getParams();
        $result = $this->_actmodel->getActividad($params);
        echo json_encode(array('data' => $result['data'], 'total' => $result['count'], 'success' => true));
    }

    function getProductoAction()
    {
        $params = $this->_request->getParams();
        $result = $this->_model->getProducto($params);
        echo json_encode(array('data' => $result['datos'], 'total' => $result['cantidad'], 'success' => true));
    }

    function getCampannaProductoAction()
    {
        $params = $this->_request->getParams();
        $result = $this->_productomodel->getCampannaProducto($params);
        echo json_encode(array('data' => $result['data'], 'total' => $result['count'], 'success' => true));
    }

    function getClienteAction()
    {
        $params = $this->_request->getParams();
        $result = $this->_actmodel->getCliente($params);
        echo json_encode(array('data' => $result['datos'], 'total' => $result['cantidad'], 'success' => true));
    }

    function getMonedaAction()
    {
        $params = $this->_request->getParams();
        $result = $this->_model->getMoneda($params);
        echo json_encode(array('data' => $result['data'], 'total' => $result['count'], 'success' => true));
    }

    function getCreadoPorAction()
    {
        $params = $this->_request->getParams();
        $result = $this->_model->getCreadoPor($params);
        echo json_encode(array('data' => $result['data'], 'total' => $result['count'], 'success' => true));
    }

    function getClienteActividadAction(){
        $params = $this->_request->getParams();
        $result = $this->_clientemodel->getClientes($params,$params['esOportunidad']);
        echo json_encode(array('data'=>$result['data'],'total'=>$result['count'],'success'=>true));
    }

}
