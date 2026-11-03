<?php

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(
            get_include_path() . PATH_SEPARATOR . $config['include_path']
    );
}

class ConfiguracionparalizacionController extends BaseController {

    private $_modelo;

    function init() {
        parent::init('log.tall.configuracion');
        $this->_modelo = new ConfiguracionParalizacionModel();
    }

    public function configuracionparalizacionAction() {
        $this->autoShow = false;
        $this->render();
    }

    public function cargarReporteParalizacionAction() {
        $this->objectHelper->synchronize($this, $this->_modelo->cargarReporteParalizacion($this->uiParams));
    }

    public function actionsReporteAction() {
        $this->_modelo->actionsReporte($this->uiParams);
        $this->success = true;
    }

    public function cargarConceptoAction() {
        if (isset($this->uiParams['all'])) {
            $this->objectHelper->synchronize($this, $this->_modelo->getListaConcepto($this->uiParams));
        } else {
            $this->objectHelper->synchronize($this, $this->_modelo->getConceptoReporte($this->uiParams));
        }
    }

    public function actionsConceptoAction() {
        $this->_modelo->actionsConcepto($this->uiParams);
        $this->success = true;
    }

}
