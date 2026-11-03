<?php

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class MantenimientotiendaController extends BaseController
{

    private $_model;

    function init()
    {
        parent::init('log.fac.mantenimientotienda');
        $this->_model = new MantenimientotiendaModel();
    }

    public function gestMantenimientotiendaAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.fac.mantenimientotienda');
        $this->renderTemplate();
    }

    public function cargarProductosAction()
    {
        $this->setDefaultParam('start', 0);
        $this->setDefaultParam('limit', 30);
        $this->objectHelper->synchronize($this, $this->_model->cargarProductos($this->uiParams));
    }

    public function cargarDevolucionesAction()
    {
        $this->setDefaultParam('start', 0);
        $this->setDefaultParam('limit', 30);
        $this->objectHelper->synchronize($this, $this->_model->cargarDevoluciones($this->uiParams));
    }

    public function descargarProductosAction()
    {
        $this->objectHelper->synchronize($this, $this->_model->descargarProductos($this->uiParams));
    }

    public function ajustarTiendaAction()
    {
        $this->objectHelper->synchronize($this, $this->_model->ajustarTienda($this->uiParams));
    }

    public function ajustarDistraAction()
    {
        $this->objectHelper->synchronize($this, $this->_model->ajustarDistra($this->uiParams));
    }

    public function devolverPedidoAction()
    {
        $this->objectHelper->synchronize($this, $this->_model->devolverPedido($this->uiParams));
    }

    public function setDevueltoAction()
    {
        $this->objectHelper->synchronize($this, $this->_model->setDevuelto($this->uiParams));
    }

    public function cargarPedidosAction()
    {
        $this->setDefaultParam('start', 0);
        $this->setDefaultParam('limit', 30);
        $this->objectHelper->synchronize($this, $this->_model->cargarPedidos($this->uiParams));
    }

    public function reprocesarAction()
    {
        $this->objectHelper->synchronize($this, $this->_model->reprocesar($this->uiParams));
    }
}
