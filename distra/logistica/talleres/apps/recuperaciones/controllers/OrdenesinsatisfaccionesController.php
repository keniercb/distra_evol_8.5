<?php
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}


class OrdenesinsatisfaccionesController extends BaseController
{

    private $_model;

    function init()
    {
        parent::init('log.tall.ordenesinsatisfacciones');
        $this->_model = new OrdenesInsatisfaccionesModel();
    }

    public function gestOrdenesinsatisfaccionesAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.tall.ordenesinsatisfacciones');
        $this->rendertemplate();
    }

    public function getOrdenesInsatisfaccionesAction()
    {
        $resultado = $this->_model->getOrdenesInsatisfacciones($this->uiParams);
        $this->datos = $resultado['datos'];
        $this->cantidad = $resultado['cantidad'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_TALLERES;
    }


}
