<?php

/**
 * Controlador gestionar documentos medidor de lectura
 * Autor: Yadrian Aguila Ferran
 * */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()
            ->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class LecturamedidorController extends BaseController // ZendExt_Controller_Secure
{

    protected $serviciosAyuda, $model, $arrayData, $bloqueoInterceptor, $configuracionService;

    public function init()
    {
        parent::init('log.fac.lecturamedidor');
        $this->serviciosAyuda = ServiciosAyudaHelper::__init();
        $this->arrayData = array('alias' => 'LecturaMedidorLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_FAC);
        // $this->model = new EntradaProxy($this->arrayData); 
        $this->configuracionService = new ConfiguracioninventarioService();
        $config = $this->configuracionService->devolverConfiguracion($this->global->Estructura->idestructura);
        $this->view->uiVariables = array_merge(
            array('useSign' => $this->objectHelper->getBooleanStr($config['firmadigital'])), $this->view->uiVariables
        );
        $this->bloqueoInterceptor = new BloqueoInterceptor($this);
    }

    public function lecturamedidorAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.fac.lecturamedidor');
        $this->rendertemplate();
    }

    /**
     * Elimina un documento dado su identificador.
     *
     * @author Yadrian Aguila Ferran
     * @return Boolean
     */
    public function eliminarDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->model->eliminarDocumento($this->uiParams['iddocumento']);
    }

    /**
     * Elimina los movimientos de un documento dado su identificador.
     *
     * @author Yadrian Aguila Ferran
     * @return (lo que retorna)
     */
    public function eliminarMovimientosAction()
    {
        $this->uiParams['idmovimientos'] = (array)Zend_Json::decode($this->uiParams['idmovimientos']);
        $this->model->getProductoModel()
            ->eliminarMovimientos(false, $this->uiParams['idmovimientos'], false, false);
    }

    /**
     * Adicionar un documento.
     *
     * @author Yadrian Aguila Ferran
     * @return Numeric
     */
    public function adicionarDocumentoAction()
    {
        $this->uiParams['data'] = $this->objectHelper->stdClassToArray(Zend_Json::decode($this->uiParams['data']));
        $this->uiParams['tarjeta'] = $this->objectHelper->stdClassToArray(
            Zend_Json::decode($this->uiParams['tarjeta'])
        );
        $this->uiParams['idproductos'] = $this->objectHelper->stdClassToArray(
            Zend_Json::decode($this->uiParams['idproductos'])
        );
        $this->uiParams = array_merge($this->uiParams, $this->uiParams['data']);
        unset($this->uiParams['data']);
        $this->unsetNullValues();
        $this->iddocumento = $this->model->adicionarDocumento($this->uiParams);
    }

    /**
     * Adiciona los movimientos asociados a un documento.
     *
     * @author Yadrian Aguila Ferran
     * @return Array
     */
    public function adicionarMovimientosAction()
    {
        $this->uiParams['idproductos'] = $this->objectHelper->stdClassToArray(
            Zend_Json::decode($this->uiParams['idproductos'])
        );
        $result = $this->model->getProductoModel()
            ->adicionarMovimientos(
                $this->uiParams['iddocumento'], $this->uiParams['idproductos'],
                LogisticaMovimientoModel::SIGNO_MOV_SUMA
            );
        $this->success = (count($result['noadicionados']) == 0);
        $this->nosalvados = count($result['noadicionados']);
    }

    /**
     * Anula el estado de un documento daod su identificador.
     *
     * @author Yadrian Aguila Ferran
     * @return Boolean
     */
    public function anularEstadoDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->model->anularEstadoDocumento($this->uiParams['iddocumento']);
    }

    /**
     * Aprueba un documento dado su identificador.
     *
     * @author Yadrian Aguila Ferran
     * @return Boolean
     */
    public function aprobarEstadoDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->model->aprobarDocumento($this->uiParams['iddocumento'], true);
    }

    /**
     * Contabiliza un documento dado su identificador.
     *
     * @return Boolean
     */
    public function contabilizarDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->comprobante = $this->model->contabilizarDocumento($this->uiParams['iddocumento']);
    }

    /**
     * Cancela un documento dado su identificador.
     *
     * @author Yadrian Aguila Ferran
     * @return Boolean
     */
    public function anularDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->model->cancelarDocumento($this->uiParams['iddocumento']);
    }

    /**
     * Devuelve los documentos dado los criterios de búsqueda especificados.
     *
     * @author Yadrian Aguila Ferran
     * @return Array
     */
    public function cargarDocumentosAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $datosBusqueda = $this->model->devolverDocumentos($this->uiParams);
        $this->datos = $datosBusqueda['datos'];
        $this->cantidad = $datosBusqueda['cantidad'];
    }

    /**
     * Devuelve los productos asociados a un documento según los
     * criterios de búsqueda especificados.
     *
     * @author Yadrian Aguila Ferran
     * @return Array
     */
    public function cargarProductosDocumentoAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $datosBusqueda = $this->model->getProductoModel()
            ->devolverMovimientos($this->uiParams);
        $objconfiginv = new ConfiguracioninventarioService();
        if ($objconfiginv->utilizarUbicacion($this->global->Estructura->idestructura)) {
            $datcofubicacion = new UtilesubicacionService();
            $confubic = $datcofubicacion->obtenerConfiguracionUbicacion($this->global->Estructura->idestructura);
            $this->confubicacion = $confubic;
        }
        $this->datos = $datosBusqueda['datos'];
        $this->cantidad = $datosBusqueda['cantidad'];
    }

    /**
     * Confirma un documento dado su identificador.
     *
     * @author Yadrian Aguila Ferran
     * @return Boolean
     */
    public function confirmarDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->model->confirmarDocumento($this->uiParams['iddocumento']);
    }

    /**
     * Crea un nuevo documento a partir de otro previamente establecido.
     *
     * @author Yadrian Aguila Ferran
     * @return Boolean
     */
    public function copiarDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->datos = $this->model->copiarDocumento($this->uiParams['iddocumento']);
    }

    /**
     * (Descripción del método, objetivo)
     *
     * @author Yadrian Aguila Ferran
     * @return (lo que retorna)
     */
    public function dispatch($action)
    {
        $this->bloqueoInterceptor->around($this, $action, $this->uiParams);
        parent::dispatch($action);
    }
}
