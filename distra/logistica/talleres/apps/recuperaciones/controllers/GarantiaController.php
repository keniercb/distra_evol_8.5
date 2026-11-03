<?php
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}


class GarantiaController extends BaseController
{

    private $_model;

    function init()
    {
        parent::init('log.tall.garantia');
        $this->_model = new GarantiaModel();
    }

    public function gestGarantiaAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.tall.garantia');
        $this->rendertemplate();
    }

    public function getOrdenesGarantiaAction()
    {
        $result = $this->_model->devolverOrdenesGarantia($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

}
