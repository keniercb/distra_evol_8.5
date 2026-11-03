<?php

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}
class VentastarjetaController extends BaseController
{
    private $serviciosAyuda;
    private $_ventasModel;

    function init()
    {
        parent::init('log.fac.ventastarjeta');
        $this->serviciosAyuda = ServiciosAyudaHelper::__init();
		$this->_ventasModel = new VentastarjetaModel();
        $this->_logisticaGlobalMonedas = LogisticaGlobal::__init()->getMonedaEntidad();
        $this->_serviciosLogisticaGlobal = LogisticaGlobal::__init();
    }
	
	public function ventastarjetaAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();

        $this->initComponent('log.fac.ventastarjeta');
        $this->rendertemplate();
    }
 	
    public function ventasxtarjetaAction()
    {
        $this->objectHelper->synchronize($this, $this->_ventasModel->ventasRealizadasPorTarjeta($this->uiParams));
    }
}