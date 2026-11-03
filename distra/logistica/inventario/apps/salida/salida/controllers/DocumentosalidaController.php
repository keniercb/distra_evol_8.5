<?php

/**
 * @class DocumentosalidaController
 * (Descripcion de la clase, objetivo)
 * @package Inventario
 * @subpackage Salida
 * @author Dainier Aguila Medina
 * @copyright XETID
 * @version 1.0
 */
class DocumentosalidaController extends SalidaController
{
    private $serviciosCFG;
    protected $configuracionService;

    function init()
    {
        $this->arrayData = array('alias' => 'valeLog');
        parent::init('log.inv.documentosalida');
        $this->serviciosCFG = ServiciosConfiguracionGeneralHelper::__init();
        $moneda = $this->configuracionHelper->monedaContableEntidad($this->global->Estructura->idestructura);
        $codigo = null;
        $idmonedas = null;
        foreach ($moneda['datos'] as $value) {
            if ($value['dualidad'] == 1) {
                $codigo['alternativa'] = $value['codigoiso'];
                $idmonedas['idmonedaalt'] = $value['idmoneda'];
            } else if ($value['tipomoneda'] == 0) {
                $codigo['contable'] = $value['codigoiso'];
                $idmonedas['idmoneda'] = $value['idmoneda'];
            }
        }
        $objDocPrim = LogisticaDocumentosHelper::__init()->devuelveIddocByIdEstructura(
            'solEntrega', $this->global->Estructura->idestructura, $this->global->Subsistema->idsubsistema
        );
        $objDocPrim->iddoc;
        $this->configuracionService = new ConfiguracioninventarioService();
        $config = $this->configuracionService->devolverConfiguracion($this->global->Estructura->idestructura);
        $array = array(
            'nombrecontable' => '"' . $codigo['contable'] . '"',
            'nombrealternativa' => '"' . $codigo['alternativa'] . '"',
            'idmoneda' => '"' . $idmonedas['idmoneda'] . '"',
            'idmonedaalt' => '"' . $idmonedas['idmonedaalt'] . '"',
            'entrega' => $objDocPrim->iddoc ? 'true' : 'false',
            'tarjetacombustible' => $this->objectHelper->getBooleanStr($config['tarjeta'])
        );
        $this->view->uiVariables = array_merge($array, $this->view->uiVariables);
    }

    public function documentoSalidaAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.inv.documentosalida');
        $this->rendertemplate();
    }

    /**
     * @return array
     */
    public function adicionarDocumentoAction()
    {
        $this->uiParams['data'] = (array) Zend_Json::decode($this->uiParams['data']);
        if ($this->uiParams['transferencia']) {
            $this->uiParams['transferencia'] = (array) Zend_Json::decode($this->uiParams['transferencia']);
        }
        $this->uiParams['idestructuracomun'] = Zend_Json::decode($this->uiParams['idestructuracomun']);
        $this->uiParams['idgenerado'] = (array) Zend_Json::decode($this->uiParams['id']);
        $this->uiParams['idclientes'] = (array) Zend_Json::decode($this->uiParams['idclientes']);
        $this->uiParams['idactividades'] = (array) Zend_Json::decode($this->uiParams['idactividades']);
        $this->uiParams['idproductos'] = (array) Zend_Json::decode($this->uiParams['idproductos']);
        $this->uiParams = array_merge($this->uiParams, $this->uiParams['data']);
        unset($this->uiParams['data']);
        unset($this->uiParams['id']);
        $this->objectHelper->synchronize($this, $this->model->adicionarDocumento($this->uiParams));
    }

    /**
     * Devuelve los movimientos de los productos asociados al documento.
     * @return array
     */
    public function cargarProductosDocumentoAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->uiParams['comprometida'] = true;
        $query = $this->model->getProductoModel()->devolverMovimientos($this->uiParams, true);
        $this->objectHelper->synchronize($this, $this->model->devolverMovimientos($query, $this->uiParams['iddocumento']));
    }

    /**
     * @return boolean
     */
    public function contabilizarDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->objectHelper->synchronize($this, $this->model->contabilizarDocumento($this->uiParams['iddocumento']));
    }
    
    /**
     * @return boolean
     */
    public function eliminarMovimientosAction()
    {
        $this->uiParams['idmovimientos'] = (array) Zend_Json::decode($this->uiParams['idmovimientos']);
        $this->objectHelper->synchronize($this, $this->model->eliminarMovimientos($this->uiParams['idmovimientos']));
    }

    /**
     * @return array
     */
    public function cargarMovLoteAction()
    {
        $this->objectHelper->synchronize($this, $this->model->cargarMovLote($this->uiParams));
    }

    /**
     * Elimina los movlote dado sus id y el lote correspondiente a cada uno 
     * en caso de ser el último de no existir más.
     * @return boolean
     */
    public function eliminarLoteAction()
    {
        $this->uiParams['data'] = (array) Zend_Json::decode($this->uiParams['data']);
        $this->uiParams['datos'] = (array) Zend_Json::decode($this->uiParams['datos']);
        $this->unsetNullValues();
        $this->success = $this->model->eliminarLote($this->uiParams['data'], $this->uiParams['datos']);
    }

    /**
     * Devuelve los tipos de documentos.
     * @return array
     */
    public function cargarTipoDocAction()
    {
        $datos = $this->model->devolverTipoDocumento();
        $this->datos = $datos;
        $this->cantidad = count($datos);
    }

    public function cargarPaisesAction()
    {
        $datos = $this->serviciosCFG->obtenerPaisesEntidad($this->global->Estructura->idestructura);
        $this->datos = $datos;
        $this->cantidad = count($datos);
    }

    /**
     * Devuelve los documentos de distribución.
     * @return array
     */
    public function cargarDocDistribucionAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->uiParams['nrodoc'] = $this->uiParams['criterio'];
        $this->objectHelper->synchronize($this, $this->model->devolverDocDistribucion($this->uiParams));
    }

    /**
     * Devuelve las solicitudes de entrega.
     * @return array
     */
    public function cargarDocSolicitudentregaAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->uiParams['nrodoc'] = $this->uiParams['criterio'];
        $this->objectHelper->synchronize($this, $this->model->devolverDocSolicitudentrega($this->uiParams));
    }

    /**
     * Devuelve los documentos de menu de alimentos.
     * @return array
     */
    public function cargarDocMenualimentoAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->uiParams['nrodoc'] = $this->uiParams['criterio'];
        $this->objectHelper->synchronize($this, $this->model->devolverDocMenualimento($this->uiParams));
    }

    /**
     * Devuelve las órdenes de trabajo.
     * @return array
     */
    public function cargarDocOrdenTrabajoAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->uiParams['nrodoc'] = $this->uiParams['criterio'];
        $this->unsetNullValues();
        $this->objectHelper->synchronize($this, $this->model->devolverDocOrdenTrabajo($this->uiParams));
    }

    /**
     * Devuelve las órdenes de trabajo.
     * @return array
     */
    public function cargarProductosEstadoEjecucionAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->unsetNullValues();
        $this->objectHelper->synchronize($this, $this->model->cargarProductosEstadoEjecucion($this->uiParams));
    }

    public function cargarClientesBusquedaAction()
    {
        $this->datos = $this->model->cargarClientesBusqueda();
    }

    public function cargarOperacionesAction()
    {
        $this->datos = $this->model->cargarOperaciones($this->uiParams);
    }

}
