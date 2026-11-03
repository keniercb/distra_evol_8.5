<?php
/**
 * Created by PhpStorm.
 * User: work
 * Date: 05/02/18
 * Time: 11:31 AM
 */
class SolicitudpagoController extends ZendExt_Controller_Secure
{

    private $_model;

    function init()
    {
        parent::init();
        $this->_model = new SolicitudPagoModel();
        $this->confcontratacion = new ConfContratacionModel();
    }

    function solicitudpagoAction()
    {
//        $this->render();
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

    function listarSolicitudesPagoAction(){
        $result = $this->_request->getParams()['idcontrato']?
            $this->_model->listarSolicitudesPago($this->_request->getParams()):
            array();
        echo json_encode($result);
    }

    function guardarSolicitudPagoAction(){
        $result = $this->_model->guardarSolicitudPago($this->_request->getParams());
        if($result){
            echo json_encode($result);
        }
    }

    function eliminarSolicitudesPagoAction(){
        echo json_encode($this->_model->eliminarSolicitudesPago(json_decode($this->_request->getParams()['idsolicitudespago'])));
    }

    function cargarFacturasAction(){
        $result = $this->_model->cargarFacturas($this->_request->getParams());
        echo json_encode($result);
    }

    function cambiarEstadoAction(){
        $result = $this->_model->cambiarEstado($this->_request->getParams());
        echo json_encode($result);
    }

    function obtenerEstadosAction(){
        $result = $this->_model->cargarEstados();
        echo json_encode($result);
    }

    function obtenerNumeroCodigoAction(){
        $result = $this->_model->obtenerNumeroCodigo($this->_request->getParams());
        echo json_encode($result);
    }

    function cargarMediosPagoAction(){
        $result = $this->_model->cargarMediosPago($this->_request->getParams());
        echo json_encode($result);
    }

    public function getConfiguracionesAction()
    {
        $result = array();
        $result['transitions'] = $this->confcontratacion->loadtransitions();
        $result['notificarinicial'] = NomProceso::getNotificacionInicial('solicitudpago');
        echo json_encode($result);
    }

    public function getDatosAdicionalesAction()
    {
        $result = array();
        $result['hitos'] = $this->_model->getHitos($this->_request->getParams());
        $result['productos'] = $this->_model->getProductos($this->_request->getParams());
        echo json_encode(array('data'=>$result));
    }

    public function filterliststoreAction(){
        echo json_encode($this->_model->filterliststore());
    }
}