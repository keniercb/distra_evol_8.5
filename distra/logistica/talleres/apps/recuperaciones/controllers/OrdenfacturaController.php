<?php
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}


class OrdenfacturaController extends BaseController
{

    private $_model;

    function init()
    {
        parent::init('log.tall.ordenfactura');
        $this->_model = new OrdenfacturaModel();
    }

    public function gestOrdenfacturaAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.tall.ordenfactura');
        $this->rendertemplate();
    }
    public function getordenesfacturaAction(){
        $this->objectHelper->synchronize($this, $this->_model->getDatosReporte($this->uiParams));
    }
}
