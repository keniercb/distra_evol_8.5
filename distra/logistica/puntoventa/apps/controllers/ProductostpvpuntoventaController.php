<?php
/**
 * Created by PhpStorm.
 * User: Gabriel
 * Date: 29/08/2016
 * Time: 3:50
 */

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class ProductostpvpuntoventaController extends BaseController
{
    private $_productostpvModel, $_serviciosLogisticaGlobal, $_logisticaGlobalMonedas;

    public function init()
    {
        parent::init('log.fac.productostpvpuntoventa');
        $this->_productostpvModel = new ProductostpvpuntoventaModel();
        $this->_serviciosLogisticaGlobal = LogisticaGlobal::__init();
        $this->_logisticaGlobalMonedas = LogisticaGlobal::__init()->getMonedaEntidad();
    }

    /**
     *Carga los productos del TPV
     **/
    public function cargarProductostpvAction()
    {
        //$this->uiParams['idmonedaalternativa'] = $this->_logisticaGlobalMonedas->idmonedaalternativa;
        //$this->uiParams['idmonedacontable'] = $this->_logisticaGlobalMonedas->idmoneda;
        //$this->uiParams['precioCero'] = true;
        //$this->uiParams['idestructuracomun'] = $this->global->estructura->idestructura;
        //  $this->uiParams['cmbArea'] = true;
        $this->objectHelper->synchronize($this, $this->_productostpvModel->cargarProductostpv($this->uiParams));
    }

    public function cargarAreasAction()
    {
        $this->uiParams['idestructura'] = $this->global->estructura->idestructura;
        $this->uiParams['cmbArea'] = true;
        $this->objectHelper->synchronize($this, $this->_productostpvModel->cargarAreas($this->uiParams));
    }
}
