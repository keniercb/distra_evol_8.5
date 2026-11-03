<?php

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class DevolucionpuntoventaController extends BaseController
{
    private $_devolucionModel, $_serviciosLogisticaGlobal,$_arrayData,$_fechacontable;
    private $model;

    public function init()
    {
        $this->_arrayData = array('isPrincipal' => true, 'alias' => 'compdevLog', 'subsistema' =>
            LogisticaGlobal::SUBSISTEMA_FAC);
        parent::init('log.fac.devolucion');
        $this->model = new ComprobanteVentaModel(array('alias' => 'compventaLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_FAC));

        $this->_devolucionModel = new DevolucionpuntoventaModel($this->_arrayData);
        $this->_serviciosLogisticaGlobal = LogisticaGlobal::__init();
        $this->_fechacontable = $this->global->FechaContable->fechasist;
        /*if($this->global->FechaContable->fechasist != $this->_fechacontable){
            throw new LogisticaException('LOG_LB_PUNTOVENTA_002');
        }*/
    }

    public function devolucionpuntoventaAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $existeInv = $this->_serviciosLogisticaGlobal->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_INV);
        $this->view->arrayJs = array($this->configuracionHelper->mostrarNomencladoresGenerales()/*,
            $this->configuracionHelper->ObtenerJSArbolNaturaleza()*/);
        $fechaSistPV = $this->_fechacontable;
        $this->view->uiVariables = array_merge(
            [
                "existeInv" => $existeInv ? $existeInv : 0,
                'fechaSistPV' => "'{$fechaSistPV}'"
            ], $this->view->uiVariables
        );
        $this->initComponent('log.fac.devolucion');
        $this->rendertemplate();
    }

    public function ventasRealizadasAction()
    {
        if($this->uiParams['deldia'] === true){
            $this->uiParams['idusuario'] = $this->global->Perfil->idusuario;
        }        
        $this->uiParams['buscar'] = $this->uiParams['criterio'];
        unset($this->uiParams['criterio']);
        $this->uiParams['devolucion'] = true;
        $this->uiParams['estado'] = EstadoDocumentoModel::ESTADO_CONTABILIZADO;
        $this->uiParams['desde'] = ($this->uiParams['desde'])?$this->uiParams['desde']:$this->_fechacontable;
        $model = new ComprobanteVentaModel();
        $this->objectHelper->synchronize($this, $model->getDocumentos($this->uiParams));
    }

    public function cargarAreasAction()
    {
        $this->uiParams['idestructura'] = $this->global->estructura->idestructura;
        $this->uiParams['cmbArea'] = true;
        $this->objectHelper->synchronize($this, $this->_devolucionModel->cargarAreas($this->uiParams));
    }

    public function cargaProductosVendidosAction()
    {
        $objD = new DevolucionpuntoventaModel();
        $r = $objD->obtenerProductosVendidos($this->uiParams);
        $this->objectHelper->synchronize($this, $r);
    }

    public function cantidadDevolucionAction()
    {
        $this->uiParams['productos'] = Zend_Json::decode($this->uiParams['productos']);
        $this->uiParams['fecha'] = date('d-m-Y');
        $this->objectHelper->synchronize($this, $this->_devolucionModel->realizarDevolucion($this->uiParams));
    }

    public function devolucionesAction()
    {
        $this->objectHelper->synchronize($this, $this->_devolucionModel->devoluciones($this->uiParams));
    }

    public function devolverventaAction()
    {
        $this->uiParams['productos'] = Zend_Json::decode($this->uiParams['productos']);
        $this->uiParams['servicios'] = Zend_Json::decode($this->uiParams['servicios']);
        if($this->uiParams['tipodevolucion'] == 1){
            $this->uiParams['productos'] = $this->_devolucionModel->obtenerProductosDevTotal($this->uiParams['idventas']);
            $this->uiParams['servicios'] = $this->_devolucionModel->obtenerServiciosDevTotal($this->uiParams['idventas']);
            $this->uiParams['idmoneda'] = (count($this->uiParams['productos'])) ? $this->uiParams['productos'][0]['idmoneda'] : $this->uiParams['servicios'][0]['idmoneda'];
        }
        $compventa = new ComprobanteVentaModel(array('alias' => 'compventaLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_FAC));
        $this->objectHelper->synchronize($this, $compventa->adicionarVenta($this->uiParams));

        /*$o = new DevolucionpuntoventaModel();
        $this->objectHelper->synchronize($this, $o->devolverVenta($this->uiParams));*/
    }

    public function obtenerTipoDocumentoAction()
    {
        $this->datos = $this->model->devolverTipoDocumentos();
    }

    public function obtenerVendedorAction()
    {
        $this->objectHelper->synchronize($this, $this->model->getVendedores($this->uiParams));
    }

    public function obtenerClientesAction()
    {
        $this->objectHelper->synchronize($this, $this->model->getClientes($this->uiParams));
    }

    public function getProductosVentaAction()
    {
        $this->objectHelper->synchronize($this, $this->model->getProductosVenta($this->uiParams));
    }

    public function getModoPagoAction()
    {
        $this->objectHelper->synchronize($this, $this->model->getModoPago());
    }
}
