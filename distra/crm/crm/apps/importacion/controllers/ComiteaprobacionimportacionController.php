<?php

/**
 * Controlador encargado de gestionar las solicitudes del comite de aprobacion
 *
 * @package        ERP-PCRM
 * @subpackage     CRM/contratacion/Controller
 * @author         Ing. Alberto Mesa Martinez <amartinez@xetid.cu>
 * @copyright (c)  2016, XETID
 * @version        1.0
 */
class ComiteaprobacionimportacionController extends ZendExt_Controller_Secure
{
    private $_model;

    function init()
    {
        $this->_model = new ComiteAprobacionModel();
        $this->_confcontrato = new ConfContratacionModel();
        parent::init();
    }

    function comiteaprobacionimportacionAction()
    {

    }

    function cargarcontratoAction()
    {
        $params = $this->_request->getPost();
        echo json_encode($this->_model->cargarContrato($params));
    }

    function cargarOfertasAction()
    {
        $params = $this->_request->getPost();
        echo json_encode($this->_model->cargarOfertas($params));
    }

    function cargarSolicitudesNegocioAction()
    {
        $params = $this->_request->getPost();
        echo json_encode($this->_model->cargarSolicitudesNegocio($params));
    }

    function guardarDictamenAction()
    {
        $params = $this->_request->getPost();
        $result = $this->_model->guardarDictamen($params);
        if ($result) {
            echo json_encode($result);
        }
    }

    function cargarDictamenesAction()
    {
        $params = $this->_request->getPost();
        echo json_encode($this->_model->cargarDictamenes($params));
    }

    function cargarProductosAction()
    {
        $params = $this->_request->getPost();
        echo json_encode($this->_model->cargarProductos($params));
    }

    public function obtenerArchivoAction()
    {
        $result = $this->_model->obtenerArchivo($this->_request->getParams());
        if ($result) {
            echo json_encode($result);
        }
    }

    function obtenerProcesosAction(){
        $params = $this->_request->getPost();
        echo json_encode($this->_model->obtenerProcesos($params));
    }

    function cargarSolicitudesPagoAction(){
        $params = $this->_request->getPost();
        echo json_encode($this->_model->cargarSolicitudesPago($params));
    }

    function cargarComitesAction(){
        $params = $this->_request->getPost();
        echo json_encode($this->_confcontrato->getConfComite($params));
    }
}
