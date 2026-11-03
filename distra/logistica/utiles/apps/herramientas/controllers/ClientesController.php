<?php


class ClientesController extends UnificadorconceptosController
{
    public function init()
    {
        parent::init('clientes');
    }
    public function clientesAction(){
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->view->arrayJs = array();
        $this->initComponent('log.tools.clientes');
        $this->renderTemplate();
    }
}