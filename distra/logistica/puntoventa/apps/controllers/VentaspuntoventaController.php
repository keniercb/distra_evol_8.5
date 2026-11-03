<?php

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class VentaspuntoventaController extends BaseController
{
    private $_ventasModel, $_serviciosLogisticaGlobal, $_logisticaGlobalMonedas;

    public function init()
    {
        parent::init('log.fac.ventarealpuntoventa');
        $this->_ventasModel = new VentaspuntoventaModel();
        $this->_logisticaGlobalMonedas = LogisticaGlobal::__init()->getMonedaEntidad();
        $this->_serviciosLogisticaGlobal = LogisticaGlobal::__init();
    }

    public function ventaspuntoventaAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $existeInv = $this->_serviciosLogisticaGlobal->estaAperturadoSubsistema(
            LogisticaGlobal::SUBSISTEMA_INV
        );
        $fechaSistPV = date('d/m/Y');
        $this->view->uiVariables = array_merge(
            array("existeInv" => $existeInv ? $existeInv : 0, 'fechaSistPV' => "'{$fechaSistPV}'"),
            $this->view->uiVariables
        );
        $this->prepareView();
        $this->initComponent('log.fac.ventarealpuntoventa');
        $this->renderTemplate();
    }

    public function ventasRealizadasPuntoVentaAction()
    {
      $this->objectHelper->synchronize($this, $this->_ventasModel->ventasRealizadas($this->uiParams));
    }

    public function cargaProductosVendidosAction()
    {
        $this->uiParams['idmonedaalternativa'] = $this->_logisticaGlobalMonedas->idmonedaalternativa;
        $this->uiParams['idmonedacontable'] = $this->_logisticaGlobalMonedas->idmoneda;
        $this->uiParams['precioCero'] = true;
        $this->objectHelper->synchronize($this, $this->_ventasModel->cargarProductosVendidos($this->uiParams));
    }

    public function cargarAreasAction()
    {
        $this->uiParams['idestructura'] = $this->global->estructura->idestructura;
        $this->uiParams['cmbArea'] = true;
        $this->objectHelper->synchronize($this, $this->_ventasModel->cargarAreas($this->uiParams));
    }	
	
	//Para recuperaciones SASA por IRINA
	//Ventas realizadas por clientes
	public function ventasRealizadasxclienteAction()
    {
        $this->objectHelper->synchronize($this, $this->_ventasModel->ventasRealizadasPorClientes($this->uiParams));
    }
	
	public function cargarAreasVentaAction()
    {
        //$this->uiParams['idestructura'] = $this->global->estructura->idestructura;
        $this->uiParams['cmbArea'] = true;
	    $this->objectHelper->synchronize($this, $this->_ventasModel->cargarTodasAreas($this->uiParams));
    }	
	
	public function cargarProductosVentaAction()
    {
          $this->objectHelper->synchronize($this, $this->_ventasModel->cargarProductosVenta($this->uiParams));
    }

    public function cargarTiendasAction()
    {
        $this->objectHelper->synchronize($this, $this->_ventasModel->cargarTiendas($this->uiParams));
    }

    public function cargarTipoDocumentoAction()
    {
        $this->objectHelper->synchronize($this, $this->_ventasModel->cargarTipoDocumento($this->uiParams));
    }

    public function cargarVendedorAction()
    {
        $this->objectHelper->synchronize($this, $this->_ventasModel->cargarVendedor($this->uiParams));
    }
}
