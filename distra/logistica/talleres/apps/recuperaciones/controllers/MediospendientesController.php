<?php
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}


class MediospendientesController extends BaseController
{

    private $_model;

    function init()
    {
        parent::init('log.tall.mediospendientes');
        $this->_model = new MediosPendientesModel();
    }

    public function gestMediospendientesAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.tall.mediospendientes');
        $this->rendertemplate();
    }

    public function getMediosPendientesAction()
    {
        $result = $this->_model->getMediosPendientes($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_TALLERES;
    }

}
