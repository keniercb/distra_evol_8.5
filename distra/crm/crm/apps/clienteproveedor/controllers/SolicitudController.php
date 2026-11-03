<?php

/**
 *
 * @package        ERP-PCRM
 * @subpackage     CRM/clienteproveedor/Controller
 * @author         Ing. Alberto Mesa Martinez <amartinez@xetid.cu>
 * @version        1.0
 */
class SolicitudController extends ZendExt_Controller_Secure
{
    private $_model;

    function init()
    {
        $this->_model = new SolicitudModel();
        parent::init();
    }

    function solicitudAction()
    {

    }

    function getSolicitudesAction(){
        $params = $this->_request->getPost();
        $result = $this->_model->getSolicitudes($params);
        echo json_encode($result);
    }

    function setEstadoSolicitudAction(){
        $params = $this->_request->getPost();
        $result = $this->_model->setEstadoSolicitud($params);
        echo json_encode($result);
    }
}
