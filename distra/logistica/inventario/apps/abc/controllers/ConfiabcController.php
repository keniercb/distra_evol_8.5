<?php

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}
class ConfiabcController extends BaseController
{
    private $configModel;
    public function init($strComponent = '')
    {
        parent::init('log.abc.configuracion');
        $this->configModel = new ConfigAbcModel(true);
    }

    public function salvarConfiguracionAction(){
        $this->configModel->guardarConfiguracin($this->uiParams);
    }

    public function obtenerConfiguracionAction(){
        $this->configModel->cargarConfiguracion($this->global->Estructura->idestructura);
    }

}