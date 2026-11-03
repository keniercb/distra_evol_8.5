<?php

/**
 * Controlador encargado de manejar lo referente a la gestion
 * de las proformas y contratos marcos del modulo Contratacion de PCRM.
 *
 * @package        ERP-PCRM
 * @subpackage     CRM/contratacion/Controller
 * @author         Ing. Alberto Mesa Martínez <amartinez@xetid.cu>
 * @copyright (c)  2015, XETID
 * @version        1.0
 */
class GestionfacturasController extends ZendExt_Controller_Secure
{
    private $_model;

    function init()
    {
        parent::init();
        $this->_model = new GestionfacturasModel();
    }

    function gestionfacturasAction()
    {
        //$this->render();
    }

    function cargarContratosAction()
    {
        $result = $this->_model->cargarContratos($this->_request->getParams());
        echo json_encode($result);
    }

    function cargarHitosAction()
    {
        $result = $this->_model->cargarHitos($this->_request->getParams());
        echo json_encode($result);
    }

    function cargarProductosServiciosAction()
    {
        $result = $this->_model->cargarProductosServicios(
            $this->_request->getParams()
        );
        echo json_encode($result);
    }

    function cargarFacturasAction()
    {
        $result = $this->_model->cargarFacturas($this->_request->getParams());
        echo json_encode($result);
    }

    function facturarAction()
    {
        $result = $this->_model->facturar($this->_request->getParams());
        echo json_encode($result);
    }

    function cambiarEstadoAction()
    {
        $result = $this->_model->cambiarEstado($this->_request->getParams());
        echo json_encode($result);
    }

    function cargarEstadosAction()
    {
        $result = $this->_model->cargarEstados($this->_request->getParams());
        echo json_encode($result);
    }

    function obtenerDocumentosAction()
    {
        $result = $this->_model->obtenerDocumentos(
            $this->_request->getParams()
        );
        echo json_encode($result);
    }

    function modificarFechaEstimadaAction()
    {
        $result = $this->_model->modificarFechaEstimada(
            $this->_request->getParams()
        );
        echo json_encode($result);
    }

    function modificarServiciosAction()
    {
        $result = $this->_model->modificarServicios(
            $this->_request->getParams()
        );
        echo json_encode($result);
    }

    public function getConfiguracionesAction()
    {
        $confcontratacion = new ConfContratacionModel();
        $result = array();
        $result['planificacion']
            = array('activo' => $confcontratacion->loadConfContratoPlanif()[0] ?
            $this->confcontratacion->loadConfContratoPlanif()[0]['activo']
            == '1' : false);
        echo json_encode($result);
    }

    function getHitoEstadoTrazasAction()
    {
        $listEstTraz = $this->_model->getEstadoTrazas(
            $this->_getParam('idhito')
        );
        echo json_encode(
            array('datos' => $listEstTraz, 'cantidad' => count($listEstTraz))
        );
    }

    public function filterliststoreAction(){
        echo json_encode($this->_model->filterliststore());
    }

    function modificarAreaAction()
    {
        $result = $this->_model->modificarArea(
            $this->_request->getParams()
        );
        echo json_encode($result);
    }
    
    function guardarDocumentosHitosAction()
    {
        $result = $this->_model->guardarDocumentosHitos(
            $this->_request->getParams()
        );
        echo json_encode($result);
    }

    function getFacturaHitoAction()
    {
        $result = $this->_model->getFacturaHito(
            $this->_request->getParams()
        );
        echo json_encode($result);
    }

    public function limpiarEspacioTrabajoAction(){
        $result = $this->_model->limpiarEspacioTrabajo($this->_request->getParams());
        echo json_encode($result);
    }
}
