<?php
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}


class CitasordenesController extends BaseController
{

    private $_model;

    function init()
    {
        parent::init('log.tall.citasordenes');
        $this->_model = new CitasordenesModel();
    }

    public function gestCitasordenesAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.tall.citasordenes');
        $this->rendertemplate();
    }

    public function getCitasOrdenesAction()
    {
        $result = $this->_model->getCitasOrdenes($this->uiParams);
        $this->success = $result['success'];
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_TALLERES;
    }


}
