<?php
class FuncioncargoController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function funcioncargoAction()
    {
        $this->view->estructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->render();
    }

    function getFuncioncargoAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $nodos = json_decode(stripslashes($this->_request->getPost('nodos')));

        for( $i=2;$i< count($nodos);$i++){
          $arr[]=$nodos[$i];
         }
       // print_r($arr);die;
        $obj = new FuncionCargoModel();
        $r = $obj->getFuncioncargo($limit, $start,$arr);
        echo(json_encode($r));
    }

    function addFuncioncargoAction()
    {
        $idestructura = $this->_request->getPost('idestructura');
        $denominacion = $this->_request->getPost('denominacion');
        $especifica = $this->_request->getPost('especifica');

        $obj = new FuncionCargoModel();
        $r = $obj->addFuncioncargo($denominacion, $idestructura,$especifica);
        echo(json_encode($r));
    }

    function updateFuncioncargoAction()
    {
        $idfunccargo = $this->_request->getPost('idfunccargo');
        $idestructura = $this->_request->getPost('idestructura');
        $denominacion = $this->_request->getPost('denominacion');
        $obj = new FuncionCargoModel();
        $r = $obj->updateFuncioncargo($denominacion, $idestructura, $idfunccargo);
        echo(json_encode($r));
    }

    function deleteFuncioncargoAction()
    {
        $idfunccargo = $this->_request->getPost('idfunccargo');
        $obj = new FuncionCargoModel();
        $r = $obj->deleteFuncioncargo($idfunccargo);
        echo(json_encode($r));
    }
}