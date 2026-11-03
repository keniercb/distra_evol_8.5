<?php
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}


class PiezasmasusadasController extends BaseController
{

    private $_model;

    function init()
    {
        parent::init('log.tall.piezasmasusadas');
        $this->_model = new PiezasMasUsadasModel();
    }

    public function gestPiezasmasusadasAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.tall.piezasmasusadas');
        $this->rendertemplate();
    }

    public function getPiezasMasUsadasAction()
    {
        $result = $this->_model->getPiezasMasUsadas($this->uiParams);
        $this->success = $result['success'];
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_TALLERES;
    }


}
