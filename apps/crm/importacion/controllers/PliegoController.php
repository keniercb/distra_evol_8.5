<?php
/**
 * Created by PhpStorm.
 * User: work
 * Date: 31/01/2020
 * Time: 12:28 PM
 */
class PliegoController extends ZendExt_Controller_Secure
{

    function init()
    {
        $this->model = new PliegoModel();
        parent::init();
    }

    function pliegoAction()
    {
//        $this->render();
    }

    function obtenerdatosOfertasProductosAction(){
        $params = $this->_request->getParams();
        $result=$this->model->obtenerdatosOfertasProductos($params);
        echo json_encode($result);
    }

    function getConfiguracionAction(){
        echo json_encode($this->model->getConfiguracion());
    }

    function crearPliegoAction(){
        echo json_encode($this->model->crearPliego($this->_request->getParams()));
    }

    function cargarDatosPliegoAction(){
        echo json_encode($this->model->cargarDatosPliego($this->_request->getParams()));
    }

    function guardarUltimaCompraAction(){
        echo json_encode($this->model->guardarUltimaCompra($this->_request->getParams()));
    }

    function getUltimaCompraAction(){
        echo json_encode($this->model->getUltimaCompra($this->_request->getParams()));
    }

    function exportarPliegoAction(){
        echo json_encode($this->model->exportarPliego($this->_request->getParams()));
    }
}