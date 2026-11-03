<?php

/**
 * Class MagentoController
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()
            ->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class MagentoController extends BaseController
{
    /**
     * @var MagentoModel
     */
    private $ordenVentaModel;


    public function init()
    {
        parent::init('log.fac.magentoadmin');
        $this->ordenVentaModel = new MagentoModel(false);


    }

    public function registroVentaAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.fac.magentoadmin');
        $this->rendertemplate();
    }

    public function getOrdenesVentaAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->objectHelper->synchronize($this, $this->ordenVentaModel->devolverOrdenes($this->uiParams));
    }

    public function cargarProductosAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->objectHelper->synchronize($this, $this->ordenVentaModel->cargarProductos($this->uiParams));
    }

    public function establecerUEBAction()
    {
        $this->uiParams['idorden'] = Zend_Json::decode($this->uiParams['idorden']);
        $this->objectHelper->synchronize($this, $this->ordenVentaModel->salvarUEB($this->uiParams));
    }

    public function entregarOrdenAction()
    {
        $this->uiParams['idorden'] = Zend_Json::decode($this->uiParams['idorden']);
        $this->objectHelper->synchronize($this, $this->ordenVentaModel->entregarOrden($this->uiParams));
    }

    public function guardarProductoAction()
    {
        $this->objectHelper->synchronize($this, $this->ordenVentaModel->salvarProducto($this->uiParams));
    }

    public function eliminarOrdenAction()
    {
        $this->objectHelper->synchronize($this, $this->ordenVentaModel->eliminarOrden($this->uiParams));
    }

    public function eliminarProductoAction()
    {
        $this->objectHelper->synchronize($this, $this->ordenVentaModel->eliminarProductos($this->uiParams));
    }

    public function getUEBAction()
    {
        $this->objectHelper->synchronize($this, $this->ordenVentaModel->obtenerUEB($this->uiParams));
    }

    public function getEstadosAction()
    {
        if ($this->uiParams['fac'] == 1) {
            $this->datos = array(
                array('id' => 1, 'denominacion' => 'Pendiente'),
                array('id' => 2, 'denominacion' => 'Factura creada'),
                array('id' => 3, 'denominacion' => 'Factura confirmada'),
                array('id' => 4, 'denominacion' => 'Factura liquidada'),
            );
        } else {
            $this->datos = array(
                array('id' => 1, 'denominacion' => 'Pago pendiente'),
                array('id' => 2, 'denominacion' => 'Pago aceptado'),
                /* array('id'=>3,'denominacion'=>'Pocesada'),
                 array('id'=>4,'denominacion'=>'Facturada'),*/
            );
        }
    }

    public function getDistribucionAction()
    {
        $this->url = $this->ordenVentaModel->getConsolidacion($this->uiParams);
    }

    public function getDistribucionTotalAction()
    {
        $this->url = $this->ordenVentaModel->getConsolidacion($this->uiParams, true);
    }

    public function transferirProductosAction()
    {
        LogisticaObjectHelper::__init()->synchronize($this, $this->ordenVentaModel->transferirProductos($this->uiParams));
    }

    public function facturarOrdenAction()
    {
        LogisticaObjectHelper::__init()->synchronize($this, $this->ordenVentaModel->facturarOrden($this->uiParams));
    }

    public function aceptarPagoAction()
    {
        LogisticaObjectHelper::__init()->synchronize($this, $this->ordenVentaModel->aceptarOrdenBanco($this->uiParams));
    }

    public function cerrarAction()
    {
        $this->ordenVentaModel->cierreFacturacion();
    }

    public function getDefaultColumnsAction()
    {

    }

    public function insertarOrdenAction()
    {
        $data = json_decode($this->uiParams['data'], true);
        $params = array(
            'direccion' => $data['direntrega'],
            'entregar' => $data['cliente'],
            'fecha' => $data['foferta'],
            'identificador' =>$data['orderId'],
        );
        LogisticaObjectHelper::__init()->synchronize($this, $this->ordenVentaModel->crearOrdenVenta($params));
    }


}
