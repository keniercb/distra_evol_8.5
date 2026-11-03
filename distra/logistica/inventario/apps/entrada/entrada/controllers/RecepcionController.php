<?php

/**
 * @class RecepcionController
 * (Descripcion de la clase, objetivo)
 *
 * @package Inventario
 * @subpackage Entrada
 * @author Dainier Aguila Medina
 * @copyright XETID
 * @version 1.0
 */
class RecepcionController extends EntradasController
{
    protected $configuracionService;

    function init($strComponent = 'log.inv.recepcion')
    {
        $this->arrayData = $this->arrayData ? $this->arrayData : array('alias' => 'recepcionLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_INV);
        parent::init($strComponent);
        $facturacion = LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_FAC);
        $this->configuracionService = new ConfiguracioninventarioService();
        $config = $this->configuracionService->devolverConfiguracion($this->global->Estructura->idestructura);
        $todasMonedas = ServiciosConfiguracionGeneralHelper::__init()->obtenerMonedasPorEntidad($this->global->Estructura->idestructura)['datos'];
        $contratacion = LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_CRM);
        $this->view->uiVariables = array_merge(
            array('facturacion' => json_encode($facturacion),
                'monedas' => json_encode($todasMonedas),
                'tarjetacombustible' => $this->objectHelper->getBooleanStr($config['tarjeta']),
                'contratacion' => $contratacion == 1 ? 'true' : 'false',
            ), $this->view->uiVariables
        );
    }

    public function gestrecepcionAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->view->arrayJs = array(
            $this->configuracionHelper->mostrarNomencladoresGenerales(),
            $this->contabilidadHelper->getComprobanteComponent(),
            $this->configuracionHelper->ObtenerJSArbolNaturaleza()
        );
        $this->initComponent('log.inv.recepcion');
        $this->renderTemplate();
    }

    /**
     * @return array
     */
    public function cargaInicialAction()
    {
        $this->datos = $this->model->cargaInicial();
    }

    /**
     * Adiciona un informe de recepción.
     * @return numeric
     */
    public function adicionarDocumentoAction()
    {
        $this->uiParams['data'] = $this->objectHelper->stdClassToArray(Zend_Json::decode($this->uiParams['data']));
        $this->uiParams['tarjeta'] = $this->objectHelper->stdClassToArray(
            Zend_Json::decode($this->uiParams['tarjeta'])
        );
        $this->uiParams['arridindicador'] = $this->objectHelper
            ->stdClassToArray(Zend_Json::decode($this->uiParams['arridindicador']));
        if (count($this->uiParams['arridindicador'])) {
            $this->uiParams['tarjeta'] = $this->uiParams['arridindicador'];
        }
        $this->uiParams['idproductos'] = $this->objectHelper->stdClassToArray(
            Zend_Json::decode($this->uiParams['idproductos'])
        );
        $this->uiParams['monedas'] = $this->objectHelper->stdClassToArray(
            Zend_Json::decode($this->uiParams['monedas'])
        );
        $this->uiParams = array_merge($this->uiParams, $this->uiParams['data']);

        unset($this->uiParams['data']);
        $this->unsetNullValues();
        $this->setDefaultParam('tipopago', null);
        $this->setDefaultParam('recargo', null);
        $this->setDefaultParam('descuento', null);
        $this->setDefaultParam('recargoalternativo', null);
        $this->setDefaultParam('descuentoalternativo', null);
        $this->setDefaultParam('cantbulto', 0);
        $this->setDefaultParam('tipobulto', null);
        $this->uiParams['idcondicionpago'] = $this->uiParams['idterminodepago'];
        $datos = $this->model->adicionarDocumento($this->uiParams);
        if ($datos['inactivos']) {
            $this->inactivos = $datos['inactivos'];
            $this->success = false;
        } else {
            $this->iddocumento = $datos['iddocumento'];
            $this->cantproductos = $this->model->getCantMovimientos($datos['iddocumento']);
            $padre = $this->model->buscarPadre($datos['iddocumento']);
            $this->idpadre = $padre[0]['idpadre'];
        }
    }

    /**
     * Devuelve los movimientos de un documento según los criterios de búsqueda especificados.
     * @return array
     */
    public function cargarProductosDocumentoAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $datosBusqueda = $this->model->devolverMovimientos($this->uiParams);
        $datcofubicacion = new UtilesubicacionService();
        $confubic = $datcofubicacion->obtenerConfiguracionUbicacion($this->global->Estructura->idestructura);
        $this->confubicacion = $confubic;
        $this->datos = $datosBusqueda['datos'];
        $this->cantidad = $datosBusqueda['cantidad'];
        $this->importeTotal= $datosBusqueda['importetotal'];
    }

    /**
     * Adiciona los movimientos asociados a un documento.
     * @return Array
     */
    public function adicionarMovimientosAction()
    {
        $this->uiParams['idproductos'] = $this->objectHelper->stdClassToArray(
            Zend_Json::decode($this->uiParams['idproductos'])
        );
        $result = $this->model->adicionarMovimientos(
            $this->uiParams['iddocumento'], $this->uiParams['idproductos'], LogisticaMovimientoModel::SIGNO_MOV_SUMA
        );
//        $this->model->cantidadMinimaProd($this->uiParams['idproductos'], $this->uiParams['iddocumento']);
        $this->cantproductos = $this->model->getCantMovimientos($this->uiParams['iddocumento']);
        $this->success = (count($result['noadicionados']) == 0);
        $this->nosalvados = count($result['noadicionados']);
    }

    /**
     * Elimina los movimientos de una recepción dado su identificador.
     */
    public function eliminarMovimientosAction()
    {
        $this->uiParams['idmovimientos'] = (array)Zend_Json::decode($this->uiParams['idmovimientos']);
        $this->objectHelper->synchronize(
            $this, $this->model->eliminarMovimientos($this->uiParams['idmovimientos'], $this->uiParams['iddocumento'])
        );
    }

    /**
     * Confirma un documento dado su identificador (asigna las cantidades por factura de cada producto).
     * @return Boolean
     */
    public function contarDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->model->contarDocumento($this->uiParams['iddocumento']);
    }

    /**
     * Confirma un documento dado su identificador.
     * @return boolean
     */
    public function confirmarDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        
        $this->success = $this->model->confirmarDocumento($this->uiParams['iddocumento']);
    }

    /**
     * Anula el estado de un documento daod su identificador.
     * @return Boolean
     */
    public function anularEstadoDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->model->anularEstadoDocumento(
            $this->uiParams['iddocumento'], $this->uiParams['estado']
        );
    }

    /**
     * Contabiliza un documento dado su identificador.
     * @return Boolean
     */
    public function contabilizarDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $datos = $this->model->contabilizarDocumento($this->uiParams['iddocumento']);
        $this->comprobante = $datos['comprobante'];
        $this->nrodif = $datos['nrodif'];
        $this->model->abrirDeposito($this->uiParams['iddocumento']);
    }

    public function cargarComboTipoDocumentoAction()
    {
        $this->datos = $this->model->cargarComboTipoDocumento();
    }

    /**
     * @return array
     */
    public function cargarComboProveedoresAction()
    {
        if ($this->uiParams['query']) {
            $filtro['nombre'] = $this->uiParams['query'];
            $filtro['codigo'] = $this->uiParams['query'];
        }
        if ($this->uiParams['criterio']) {
            $filtro['nombre'] = $this->uiParams['criterio'];
            $filtro['codigo'] = $this->uiParams['criterio'];
        }
        if ($this->uiParams['iddepositarios']) {
            $idclientes = explode(',', $this->uiParams['iddepositarios']);
        }
        $datos = $this->configuracionHelper->getClientesProveedorByParams(
            $idclientes, $this->global->Estructura->idestructura, true, false, true, $filtro, $this->uiParams['start'],
            $this->uiParams['limit']
        );
        $this->datos = $datos['datos'];
        $this->total = $datos['cantidad'];
        $this->cantidad = $datos['cantidad'];
    }

    /**
     * Devuelve los documentos de procesos externos ("Factura", "Conduce", "Tranferencia","Produccion").
     */
    public function cargarDocumentosExternosAction()
    {
        $this->objectHelper->synchronize($this, $this->model->cargarDocumentosExternos($this->uiParams));
    }

    public function cargarProductosDocumentoExternoAction()
    {
        $this->unsetNullValues();
        $this->objectHelper->synchronize($this, $this->model->cargarProductosDocumentoExterno($this->uiParams));
    }

    /**Devuelve las monedas que no son ni contable ni alternativas
     * @return array
     */
    public function cargarMonedasDiferentesAction()
    {
        $this->objectHelper->synchronize($this, $this->model->cargarMonedasDiferentes());

    }
   /** Suma la columna de importes del grid interno*/

    public function sumarImportesInternosAction()
    {
        $this->objectHelper->synchronize($this, $this->model->sumarImportesInternos());

    }

    public function cargarCondicionPagoAction()
    {
        $this->objectHelper->synchronize($this, $this->model->obtenerCondicionesPago($this->uiParams));
    }

    /**Devuelve las contratos que corresponden al suministrador seleccionado
     * @return array
     */
    public function cargarContratosAction()
    {
        
        if($this->uiParams['idclienteproveedor']){
            $this->uiParams['start'] = $this->uiParams['start'] ? $this->uiParams['start'] : 0;
            $this->uiParams['limit'] = $this->uiParams['limit'] ? $this->uiParams['limit'] : 30;
            $this->objectHelper->synchronize($this, $this->model->getContratos($this->uiParams));
        }else{
            $this->datos=[];
            $this->cantidad=0;
        }
    }
    
    public function cargarConceptosAction(){
        $this->objectHelper->synchronize($this, $this->model->cargarConceptosImporte($this->uiParams));
    }

    public function cargarProductos711Action(){
        $this->objectHelper->synchronize($this, $this->model->cargarProductos711($this->uiParams));
    }

    public function cargarProductoErrorAction() {
        $this->objectHelper->synchronize($this, $this->model->cargarProductoError($this->uiParams));
    }

    public function eliminarImportarAction() {
        $this->objectHelper->synchronize($this, $this->model->eliminarImportar($this->uiParams));
    }
    public function cargarServContratoAction(){
        $this->uiParams['start'] = $this->uiParams['start'] ? $this->uiParams['start'] : 0;
        $this->uiParams['limit'] = $this->uiParams['limit'] ? $this->uiParams['limit'] : 30;
        $this->objectHelper->synchronize($this, $this->model->getServContrato($this->uiParams));
    }
    public function cargarProdContratoAction(){
        $this->uiParams['start'] = $this->uiParams['start'] ? $this->uiParams['start'] : 0;
        $this->uiParams['limit'] = $this->uiParams['limit'] ? $this->uiParams['limit'] : 30;
        $this->objectHelper->synchronize($this, $this->model->getProdContrato($this->uiParams));
    }
    public function getPuertosAction(){
        $this->uiParams['start'] = $this->uiParams['start'] ? $this->uiParams['start'] : 0;
        $this->uiParams['limit'] = /*$this->uiParams['limit'] ? $this->uiParams['limit'] : */15;
        $this->objectHelper->synchronize($this, $this->model->getPuertos($this->uiParams));
    }

    public function generarCodigoBarrasProductoErrorAction()
    {
        $this->objectHelper->synchronize($this, $this->model->generarCodigoBarrasProductoError($this->uiParams));
    }
}
