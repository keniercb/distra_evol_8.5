<?php
class ConfigespecializacioncargoController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function configespecializacioncargoAction()
    {
        $this->render();
    }

    function getHomologacionesAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $idcargo = $this->_request->getPost('idcargo');
        $obj = new ConfEspcargoModel();
        $r = $obj->getHomologaciones($limit, $start, $idcargo);
        echo(json_encode($r));
    }

    function getCargosAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $filtro = $this->_request->getPost('filtro');
        $obj = new ConfEspcargoModel();
        $r = $obj->getCargos($limit, $start, $filtro);
        echo(json_encode($r));
    }

    function addHomologacionAction()
    {
        $idcargo = $this->_request->getPost('idcargo');
        $denominacion = $this->_request->getPost('denominacion');
        $obj = new ConfEspcargoModel();
        $r = $obj->addHomologacion($denominacion, $idcargo);
        echo(json_encode($r));
    }

    function updateHomologacionAction()
    {
        $idespcargo = $this->_request->getPost('idespcargo');
        $idcargo = $this->_request->getPost('idcargo');
        $denominacion = $this->_request->getPost('denominacion');
        $obj = new ConfEspcargoModel();
        $r = $obj->updateHomologacion($denominacion, $idcargo, $idespcargo);
        echo(json_encode($r));
    }

    function deleteHomologacionAction()
    {
        $idespcargo = $this->_request->getPost('idespcargo');
        $obj = new ConfEspcargoModel();
        $r = $obj->deleteHomologacion($idespcargo);
        echo(json_encode($r));
    }
}