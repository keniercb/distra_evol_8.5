<?php
/**
 * Created by PhpStorm.
 * User: work
 * Date: 05/02/18
 * Time: 11:31 AM
 */
class ReportecontratacionController extends ZendExt_Controller_Secure
{

    private $_model;

    function init()
    {
        parent::init();
        $this->model = new ReporteContratacionModel();
        $this->contrato = new GestioncontratoModel();
//        $this->confcontratacion = new ConfContratacionModel();
//        $this->dat = new DatContrato();
    }

    function reportecontratacionAction()
    {
//        $this->render();
    }

    function cargarContratosXAreaAction(){
        $post = $this->_request->getParams();
        $result = $this->model->cargarContratosXArea($post);
        echo json_encode(array('success' => true, 'children' => $result, 'cant' => count($result)));
    }

    function obtenerEstadosAction(){
        $result = $this->model->obtenerEstados();
        echo json_encode($result);
    }

    function getAreasAction(){
        $params = $this->_request->getParams();
        $areas = $this->model->cargarContratosXArea($params, false);
        $result=$areas;
//        if($params['node']=='root'){
//            $result=$this->model->obtenerDatosEntidad();
//            $result['children']=$areas;
//            $result['expanded']=true;
//        }
//        echo json_encode($result);
        echo json_encode(array('success' => true, 'children' => $result, 'cant' => count($areas)));
    }

    function obtenerDatosEntidadAction(){
        $result = $this->model->obtenerDatosEntidad();
        echo json_encode($result);
    }

    function obtenerDatosContratoAction(){
        $result=array();
        if($this->_request->getParams()['idcontrato']){
            $result = $this->model->obtenerDatosContrato($this->_request->getParams()['idcontrato']);
        }
        echo json_encode($result);
    }


}