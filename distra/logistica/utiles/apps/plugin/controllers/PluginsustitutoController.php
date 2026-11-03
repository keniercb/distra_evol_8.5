<?php

/**
 * Clase controladora para gestionar los datos del plugin depostio
 *
 * @author Maricet Estvez Fresnedo
 *
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}
class PluginsustitutoController extends BaseController
{

    private $serviciosAyuda, $sustitutoModel;

    public function init()
    {
        parent::init('log.lb.sustituto');

        $this->serviciosAyuda = ServiciosAyudaHelper::__init();
        $this->sustitutoModel = new SustitutosModel();
    }

    public function getSustitutosAction() {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->objectHelper->synchronize($this, $this->sustitutoModel->getSustitutos($this->uiParams));
    }

    public function adicionarSustitutoAction() {
        $this->success = $this->sustitutoModel->adicionarSustituto($this->uiParams);
    }

    public function eliminarSustitutoAction() {
        $this->success = $this->sustitutoModel->eliminarSustituto($this->uiParams);
    }



}
