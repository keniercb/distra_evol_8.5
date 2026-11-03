<?php

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class ExistenciaswsController extends BaseController {

    private $model;

    function init() {
        parent::init('log.lb.pgm_local');
        $this->model = new ExistenciasWSModel();
    }

    public function loadStoreAction() {
        $this->unsetNullValues();
        $this->objectHelper->synchronize($this, $this->model->cargarExistencias($this->uiParams));
    }

}
