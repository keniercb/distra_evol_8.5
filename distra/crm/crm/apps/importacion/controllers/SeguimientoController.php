<?php

/**
 * Created by PhpStorm.
 * User: work
 * Date: 05/02/18
 * Time: 11:31 AM
 */
class SeguimientoController extends ZendExt_Controller_Secure
{

    private $_model;

    function init()
    {
        parent::init();
        $this->_model = new SeguimientoModel();
        $this->confcontratacion = new ConfContratacionModel();
    }

    function seguimientoAction()
    {
//        $this->render();
    }

    function cargarContratosAction()
    {
        $result = $this->_model->cargarContratos($this->_request->getParams());
        echo json_encode($result);
    }

//    function cargarHitosAction()
//    {
//        $result = $this->_model->cargarHitos($this->_request->getParams());
//        echo json_encode($result);
//    }

    function listarArribosAction()
    {
//        print_r($this->_request->getParams());die;
        $result = $this->_request->getParams()['idcontrato']
            ?
            $this->_model->listarArribos($this->_request->getParams())
            :
            array();
        echo json_encode($result);
    }

    function getAEstadoTrazasAction()
    {
        $listEstTraz = $this->_model->getAEstadoTrazas(
            $this->_getParam('idarribo')
        );
        echo json_encode(
            array('datos' => $listEstTraz, 'cantidad' => count($listEstTraz))
        );
    }

    function guardarArriboAction()
    {
        $result = $this->_model->guardarArribo(
            $this->_request->getParams()
        );
        if ($result) {
            echo json_encode($result);
        }
    }

    function eliminarArriboAction()
    {
        echo json_encode(
            $this->_model->eliminarArribo(
                json_decode($this->_request->getParams()['idarribos'])
            )
        );
    }

    function cargarFacturasAction()
    {
        $result = $this->_model->cargarFacturas($this->_request->getParams());
        echo json_encode($result);
    }

    function cambiarEstadoAction()
    {
        $result = $this->_model->cambiarEstado($this->_request->getParams());
        echo json_encode($result);
    }

    function obtenerEstadosAction()
    {
        $result = $this->_model->cargarEstados();
        echo json_encode($result);
    }

    function obtenerNumeroCodigoAction()
    {
        $result = $this->_model->obtenerNumeroCodigo(
            $this->_request->getParams()
        );
        echo json_encode($result);
    }

    function cargarMediosPagoAction()
    {
        $result = $this->_model->cargarMediosPago($this->_request->getParams());
        echo json_encode($result);
    }

    public function getConfiguracionesAction()
    {
        $result = array();
        $result['transitions'] = $this->confcontratacion->loadtransitions();
        echo json_encode($result);
    }

    public function getDatosAdicionalesAction()
    {
        $result = array();
        $result['productos'] = $this->_model->getProductos($this->_request->getParams());
        $result['pedidos'] = $this->_model->getPedidos($this->_request->getParams());
//        $result['productosseguimiento'] = $this->_model->getProductosSeguimiento($this->_request->getParams());
        echo json_encode(array('data' => $result));
    }

    public function filterliststoreAction(){
        echo json_encode($this->_model->filterliststore());
    }

    public function getPenalizacionesArriboAction()
    {
        $result = $this->_model->getPenalizacionesArribo($this->_request->getParams());
        echo json_encode($result);
    }
}