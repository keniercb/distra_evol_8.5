<?php


class ProductosController extends UnificadorconceptosController
{
    public function init()
    {
        parent::init('productos');
    }
    public function productosAction(){
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->view->arrayJs = array();
        $this->initComponent('log.tools.productos');
        $this->renderTemplate();
    }
}