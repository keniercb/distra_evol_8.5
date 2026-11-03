<?php

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class RecupdevolucionpuntoventaController extends BaseController
{
    private $_devolucionModel;
    public function init()
    {
        parent::init('log.fac.devolucionpuntoventa');
        $this->_devolucionModel = new DevolucionpuntoventaModel();
    }

    public function recupdevolucionpuntoventaAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $fechaSistPV = date('d/m/Y');
        $this->view->uiVariables = array_merge(['fechaSistPV' => "'{$fechaSistPV}'"], $this->view->uiVariables);
        $this->prepareView();
        $this->initComponent('log.fac.devolucionpuntoventa');
        $this->renderTemplate();
    }

    public function devolucionesAction()
    {
        $this->objectHelper->synchronize($this, $this->_devolucionModel->devoluciones($this->uiParams));
    }

    public function cargarAreasAction()
    {
        $this->uiParams['idestructura'] = $this->global->estructura->idestructura;
        $this->uiParams['cmbArea'] = true;
        $this->objectHelper->synchronize($this, $this->_devolucionModel->cargarAreas($this->uiParams));
    }

    public function cargarProductoDevueltoAction()
    {
        $this->objectHelper->synchronize($this, $this->_devolucionModel->cargarProdDevueltos($this->uiParams));
    }
}
