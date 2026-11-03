<?php

/**
 * Created by PhpStorm.
 * User: madrid
 * Date: 16/11/2016
 * Time: 10:19
 */
class GestionarconceptosdeaportesController extends ZendExt_Controller_Secure
{

    function init()
    {
        parent::init();
    }

    public function gestionarconceptosdeaportesAction()
    {
        $this->render();
    }


    public function listarConceptosDeAportesAction()
    {
        $objModel = new NomConceptoAportesModel();
        $result->data = $objModel->listarConceptosAportes();
        echo json_encode($result);
    }

    public function adicionarConceptoDeAporteAction()
    {
        $parametros->denominacion = $this->_request->getParam('denominacion');
        $parametros->descripcion = $this->_request->getParam('descripcion');
        $parametros->valor = $this->_request->getParam('valor');
        $parametros->uriconceptoaporte = strtolower(str_replace(" ", "", $this->_request->getParam('denominacion')));
        $objModel = new NomConceptoAportesModel();
        $objModel->adicionarConceptoAporte($parametros);
        echo json_encode(array('adiciono' => 1));
    }

    public function modificarConceptoDeAporteAction()
    {
        $parametros->denominacion = $this->_request->getParam('denominacion');
        $parametros->descripcion = $this->_request->getParam('descripcion');
        $parametros->valor = $this->_request->getParam('valor');
        $parametros->idconceptoaporte = $this->_request->getParam('idconceptoaporte');
        $parametros->uriconceptoaporte = str_replace(" ", "", $this->_request->getParam('denominacion'));
        $objModel = new NomConceptoAportesModel();
        $objModel->modificarConceptoAporte($parametros);
        echo json_encode(array('modifico' => 1));
    }

    public function eliminarConceptoDeAporteAction()
    {
        $parametros->idconceptoaporte = json_decode(stripslashes($this->_request->getParam('idconceptosaportes')));
        $parametros->idconceptoaporteseparados = implode(',',$parametros->idconceptoaporte);
        $objModel = new NomConceptoAportesModel();
        $objModel->eliminarConceptoAporte($parametros);
        echo json_encode(array('elimino' => 1));
    }

}