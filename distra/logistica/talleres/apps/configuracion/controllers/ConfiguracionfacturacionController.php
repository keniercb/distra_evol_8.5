<?php
/**
 * @class   ConfiguracionfacturacionController
 * @author  Daniel Arias Espinosa
 * @version 1.1
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(
        get_include_path() . PATH_SEPARATOR . $config['include_path']
    );
}

class ConfiguracionfacturacionController extends BaseController //Zend_Controller_Action
{
    private $_modelo;

    function init()
    {
        parent::init('log.tall.configuracion');
        $this->_modelo = new ConfiguracionFacturacionModel();
    }

    public function configuracionfacturacionAction()
    {
        $this->autoShow = false;
        $this->render();
    }
    public function cargarOperacionesMayAction() {
        $this->objectHelper->synchronize($this, $this->_modelo->getOperacionesMay());
    }
    public function cargarOperacionesAction() {
        $this->objectHelper->synchronize($this, $this->_modelo->getOperaciones());
    }

    public function guardarConfFacturacionAction() {
        $this->success = $this->_modelo->guardarConfiguracion($this->uiParams);
    }

    public function cargarConfFacturacionAction() {
        $this->objectHelper->synchronize($this, $this->_modelo->cargarConfFacturacion());
    }


}
