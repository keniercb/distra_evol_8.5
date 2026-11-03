<?php


class DesgloseContratosController extends ZendExt_Controller_Secure
{
    private $model;

    function init()
    {
        parent::init();
        $this->model = new DesglosecontratosModel();
    }

    function desglosecontratosAction()
    {
        //$this->render();
    }

	function cargarHitosAreasAction(){
		$params = $this->_request->getParams();
        $result = $this->model->cargarHitosAreas($params);
		echo json_encode($result);
	}
	
	function guardarAreasImplicadasAction(){
		$params = $this->_request->getParams();
        $result = $this->model->guardarAreasImplicadas($params);
		echo json_encode($result);
	}

    function getAreasTodasAction(){
        $params = $this->_request->getParams();
        $result = $this->model->getAreasTodas($params);
        echo json_encode($result);
    }

    function cargarHitosAction()
    {
        $result = $this->model->cargarHitos($this->_request->getParams());
        echo json_encode($result);
    }
    function certificarDesgloseAction(){
        $params = $this->_request->getParams();
        $result = $this->model->certificarDesglose($params);
        echo json_encode($result);
    }
    function cargarHitosHeredarAction(){
        $params = $this->_request->getParams();
        $result = $this->model->cargarHitosHeredar($params);
        echo json_encode($result);
    }
    function guardarHerenciaAction(){
        $params = $this->_request->getParams();
        $result = $this->model->guardarHerencia($params);
        echo json_encode($result);
    }
}
