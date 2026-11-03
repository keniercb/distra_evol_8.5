<?php

class PanelcontrolController extends ZendExt_Controller_Secure
{
    private $_campmodel;
    private $_oportmodel;

    function init()
    {
        parent::init();
        $this->_model = new PanelControlModel();
    }

    function panelcontrolAction()
    {
//        $this->render();
    }

    function getCantOportunidadesMesAction()
    {
        $params = $this->_request->getParams();
        $result = $this->_model->getCantOportunidadesMes($params);
        echo json_encode($result);
    }

    function getClientesPotencialesAction()
    {
        $params = $this->_request->getParams();
        $result = $this->_model->getClientesPotenciales($params);
        echo json_encode($result);
    }

    function getCampannasPotencialesAction()
    {
        $params = $this->_request->getParams();
        $result = $this->_model->getCampannasPotenciales($params);
        echo json_encode($result);
    }
}
