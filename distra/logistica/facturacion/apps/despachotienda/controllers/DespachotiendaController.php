<?php

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class DespachotiendaController extends BaseController
{

    private $_model;

    function init()
    {
        parent::init('log.fac.despachotienda');
        $this->_model = new DespachotiendaModel();
    }

    public function gestDespachotiendaAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.fac.despachotienda');
        $this->renderTemplate();
    }


    public function cargarDespachosAction()
    {
        $this->uiParams['start'] = $this->uiParams['start'] ? $this->uiParams['start'] : 0;
        $this->uiParams['limit'] = $this->uiParams['limit'] ? $this->uiParams['limit'] : 30;
        $this->objectHelper->synchronize($this, $this->_model->cargarDespachos($this->uiParams));
    }

    public function devolverFacturasAction()
    {
        $this->uiParams['start'] = $this->uiParams['start'] ? $this->uiParams['start'] : 0;
        $this->uiParams['limit'] = $this->uiParams['limit'] ? $this->uiParams['limit'] : 30;
        $this->objectHelper->synchronize($this, $this->_model->devolverFacturas($this->uiParams));
    }

    public function devolverProductosAction()
    {
        $this->uiParams['start'] = $this->uiParams['start'] ? $this->uiParams['start'] : 0;
        $this->uiParams['limit'] = $this->uiParams['limit'] ? $this->uiParams['limit'] : 30;
        $this->objectHelper->synchronize($this, $this->_model->devolverProductos($this->uiParams));
    }

    public function guardarDespachoAction() {
        $this->uiParams['despachados'] = json_decode($this->uiParams['despachados']);
        $this->objectHelper->synchronize($this,$this->_model->guardarDespacho($this->uiParams));
    }

    public function generarDespachoAction() {
        $this->objectHelper->synchronize($this,$this->_model->generarDespacho($this->uiParams));
    }

    public function aprobarDespachoAction() {
        $this->objectHelper->synchronize($this,$this->_model->aprobarDespacho($this->uiParams));
    }

    public function eliminarDespachoAction() {
        $this->objectHelper->synchronize($this,$this->_model->eliminarDespacho($this->uiParams));
    }

    public function eliminarFacturasAction() {
        $this->uiParams['facturas'] = json_decode($this->uiParams['facturas']);
        $this->objectHelper->synchronize($this,$this->_model->eliminarFacturas($this->uiParams));
    }

    public function devolverProductosPedidoAction() {
        $this->uiParams['facturas'] = json_decode($this->uiParams['facturas']);
        $this->objectHelper->synchronize($this,$this->_model->devolverProductosPedido($this->uiParams));
    }

    public function completarDespachoAction() {
        $this->objectHelper->synchronize($this,$this->_model->completarDespacho($this->uiParams));
    }

    public function getDestinosAction() {
        $this->objectHelper->synchronize($this,$this->_model->getDestinos($this->uiParams));
    }

    public function verificarIncompletosAction() {
        $this->objectHelper->synchronize($this,$this->_model->verificarIncompletos($this->uiParams));
    }

}
