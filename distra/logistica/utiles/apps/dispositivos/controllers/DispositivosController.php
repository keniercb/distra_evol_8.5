<?php

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class DispositivosController extends BaseController
{

    private $_model;

    public function init($strComponent = '')
    {
        parent::init('log.lb.dispositivos');
        $this->_model = new DispositivosModel();
    }

    public function gestDispositivosAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.lb.dispositivos');
        $this->renderTemplate();
    }

    public function adicionarDispositivoAction()
    {
        $this->objectHelper->synchronize($this, $this->_model->adicionarDispositivo());
    }

    public function cargarDispositivosAction()
    {
        $this->uiParams['start'] = $this->uiParams['start'] ? $this->uiParams['start'] : 0;
        $this->uiParams['limit'] = $this->uiParams['limit'] ? $this->uiParams['limit'] : 30;
        $this->objectHelper->synchronize($this, $this->_model->cargarDispositivos($this->uiParams));
    }

    public function habilitarAction()
    {
        $ruta = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/recursos/';
        //( new FacertIntegrationService())->generarFactura("{$ruta}factura.xml","{$ruta}pass.txt","{$ruta}certificado.p12");
        //( new FacertIntegrationService())->obtenerFactura("123333");
        $this->uiParams['dispositivos'] = json_decode($this->uiParams['dispositivos']);
        $this->objectHelper->synchronize($this, $this->_model->habilitar($this->uiParams));
    }

    public function cargarDepositosAction()
    {
        $this->uiParams['start'] = $this->uiParams['start'] ? $this->uiParams['start'] : 0;
        $this->uiParams['limit'] = $this->uiParams['limit'] ? $this->uiParams['limit'] : 30;
        $this->objectHelper->synchronize($this, $this->_model->cargarAlmacenes($this->uiParams));
    }

    public function modificarDispositivoAction()
    {
        $this->objectHelper->synchronize($this, $this->_model->modificar($this->uiParams));
    }
}
