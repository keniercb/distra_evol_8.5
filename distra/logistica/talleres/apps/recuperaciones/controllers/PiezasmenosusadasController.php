<?php
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}


class PiezasmenosusadasController extends BaseController
{

    private $_model;

    function init()
    {
        parent::init('log.tall.piezasmenosusadas');
        $this->_model = new PiezasMenosUsadasModel();
    }

    public function gestPiezasmenosusadasAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.tall.piezasmenosusadas');
        $this->rendertemplate();
    }

    public function getPiezasMenosUsadasAction()
    {
        $this->_model->getPiezasMenosUsadas($this->uiParams);
    }


}
