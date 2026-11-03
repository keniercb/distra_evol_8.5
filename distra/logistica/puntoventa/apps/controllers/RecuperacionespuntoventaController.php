<?php

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class RecuperacionespuntoventaController extends BaseController
{
    function init()
    {
        parent::init('log.fac.recupuntoventa');
    }

    function recuperacionespuntoventaAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->view->arrayJs = array(
            $this->configuracionHelper->mostrarNomencladoresGenerales(),
            $this->configuracionHelper->ObtenerJSArbolNaturaleza()

        );
        $this->initComponent('log.fac.recupuntoventa');
        $this->renderTemplate();
    }
}
