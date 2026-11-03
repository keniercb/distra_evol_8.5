<?php
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}


class SasaController extends BaseController
{

    private $_model;

    function init()
    {
        parent::init('log.tall.reportes');
        $this->_model = new RecuperacionesModel();
    }

    public function indexAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.tall.reportes');
        $this->rendertemplate();
    }

    /**
     * Devuelve la informacion dado los criterios de búsqueda especificados.
     * @author Yadrian Aguila
     * @return Array
     */
    public function executeQueryAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->uiParams['data'] = json_decode($this->uiParams['data'],true);
        $this->objectHelper->synchronize($this, $this->_model->executeQuery($this->uiParams));
    }

}
