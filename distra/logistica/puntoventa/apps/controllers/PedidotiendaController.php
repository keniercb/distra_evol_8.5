<?php

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class PedidotiendaController extends BaseController
{
    /**
     * @var PedidotiendaModel
     */
    private $_model;

    function init()
    {
        parent::init('log.fac.pedidotienda');
        $this->_model = new PedidotiendaModel();
    }

    public function gestPedidotiendaAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->view->arrayJs = array($this->configuracionHelper->mostrarNomencladoresGenerales());
        $this->initComponent('log.fac.pedidotienda');
        $this->renderTemplate();
    }


    public function cargarPedidosAction()
    {
        $this->objectHelper->synchronize($this, $this->_model->cargarPedidos($this->uiParams));
    }

    public function devolverProductosAction()
    {
        $this->objectHelper->synchronize($this, $this->_model->devolverProductos($this->uiParams));
    }

    public function devolverPagosAction()
    {
        $this->objectHelper->synchronize($this, $this->_model->devolverPagos($this->uiParams));
    }

    public function devolverRegistrablesAction()
    {
        $this->objectHelper->synchronize($this, $this->_model->devolverRegistrables($this->uiParams));
    }

    public function descargarPedidosAction() {
        $this->objectHelper->synchronize($this,$this->_model->descargarPedidos($this->uiParams));
    }

    public function descargarVentasCRAction() {
        $this->objectHelper->synchronize($this,$this->_model->descargarVentasCR($this->uiParams));
    }

    public function procesarPedidosAction() {
        $this->objectHelper->synchronize($this,$this->_model->procesarPedidos($this->uiParams));
    }

    public function guardarDevolucionAction() {
        $this->uiParams['devuelto'] = json_decode($this->uiParams['devuelto']);
        $this->objectHelper->synchronize($this,$this->_model->guardarDevolucion($this->uiParams));
    }

    public function devolverPedidoAction() {
        $this->objectHelper->synchronize($this,$this->_model->devolverPedido($this->uiParams));
    }

    public function getProductosPedidoAction()
    {
        $this->uiParams['start'] = $this->uiParams['start'] ? $this->uiParams['start'] : 0;
        $this->uiParams['limit'] = $this->uiParams['limit'] ? $this->uiParams['limit'] : 30;
        $this->objectHelper->synchronize($this, $this->_model->getProductosPedido($this->uiParams));
    }

    public function getDocumentosGeneradosAction()
    {
        $this->objectHelper->synchronize($this, $this->_model->getDocumentosGenerados($this->uiParams));
    }

    public function getDevolucionesPedidoAction()
    {
        $this->objectHelper->synchronize($this, $this->_model->getDevolucionesPedido($this->uiParams));
    }

    public function  openGoldenXmlAction(){
        $this->objectHelper->synchronize($this, $this->_model->exportarXmlGolden($this->uiParams));
    }

    public function cancelarPedidoAction() {
        $this->objectHelper->synchronize($this, $this->_model->cancelarPedido($this->uiParams));
    }

    public function adicionarProductoAction() {
        $this->objectHelper->synchronize($this, $this->_model->adicionarProducto($this->uiParams));
    }

    public function cargarProductosAction() {
        $this->objectHelper->synchronize($this, $this->_model->cargarProductos($this->uiParams));
    }

    public function eliminarProductosAction() {
        $this->objectHelper->synchronize($this, $this->_model->eliminarProductos($this->uiParams));
    }
}
