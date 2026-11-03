<?php
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class DocumentoController extends BaseController
{
    protected $model, $fechaContable, $configuracionGeneral;

    public function init($component)
    {
        parent::init($component);
        $this->model = new DocumentoModel(array());

    }

    public function cargaInicialAction()
    {
        $obj = new DocumentoLogisticaModel();
        $datos = $obj->cargaInicial();
        $this->configuracionGeneral = ServiciosConfiguracionGeneralHelper::__init();
        $this->fechaContable = $this->configuracionGeneral->getFechaContableSubsistemaObj(
            $this->global->Estructura->idestructura, 18
        )->fecha;
        $datos['fechacontable'] = $this->fechaContable;

        $this->datos = $datos;

    }

    /**
     * Adicionar un documento.
     * @author Yadrian Aguila
     * @return Numeric
     */
    public function adicionarDocumentoAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->uiParams['data'] = $this->objectHelper->stdClassToArray(Zend_Json::decode($this->uiParams['data']));
        $this->uiParams = array_merge($this->uiParams, $this->uiParams['data']);
        unset($this->uiParams['data']);
        $this->unsetNullValues();
        $this->objectHelper->synchronize($this, $this->model->adicionarDocumento($this->uiParams));
    }


    /**
     * Devuelve los documentos dado los criterios de búsqueda especificados.
     * @author Yadrian Aguila
     * @return Array
     */
    public function cargarDocumentosAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->setDefaultParam('idestructura', $this->global->Estructura->idestructura);
        $this->objectHelper->synchronize($this, $this->model->devolverDocumentos($this->uiParams));
    }

    /**
     * Devuelve los documentos dado los criterios de búsqueda especificados.
     * @author Yadrian Aguila
     * @return Array
     */
    public function cargarEncabezadoAction()
    {
        $this->objectHelper->synchronize($this, $this->model->cargarEncabezado($this->uiParams));
    }

    /**
     * Elimina un documento dado su identificador.
     * @author Yadrian Aguila
     * @return Boolean
     */
    public function eliminarDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->model->eliminarDocumento($this->uiParams);
    }

    /**
     * Anula el estado de un documento daod su identificador.
     * @author Yadrian Aguila
     * @return Boolean
     */
    public function anularEstadoDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->model->anularEstadoDocumento($this->uiParams['iddocumento']);
    }

    /**
     * Aprueba un documento dado su identificador.
     * @author Yadrian Aguila
     * @return Boolean
     */
    public function aprobarDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->model->aprobarDocumento($this->uiParams['iddocumento'], true);
    }

    /**
     * Cancela un documento dado su identificador.
     * @author Yadrian Aguila
     * @return Boolean
     */
    public function anularDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->model->cancelarDocumento($this->uiParams['iddocumento']);
    }

    /**
     * Confirma un documento dado su identificador.
     * @author Yadrian Aguila
     * @return Boolean
     */
    public function confirmarDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->model->confirmarDocumento($this->uiParams['iddocumento']);
    }

    /**
     * Crea un nuevo documento a partir de otro previamente establecido.
     * @author Yadrian Aguila
     * @return Boolean
     */
    public function copiarDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->datos = $this->model->copiarDocumento($this->uiParams['iddocumento']);
    }

    /**
     * Crea un nuevo documento a partir de otro previamente establecido.
     * @author Yadrian Aguila
     * @return Boolean
     */
    public function cerrarDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->datos = $this->model->cerrarDocumento($this->uiParams['iddocumento']);
    }

    /**
     * Devuelve los movimientos de un documento según los criterios de búsqueda especificados.
     * @author Yadrian Aguila
     * @return Array
     */
    public function cargarProductosDocumentoAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->objectHelper->synchronize($this, $this->model->cargarProductosDocumento($this->uiParams));
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
        $this->objectHelper->synchronize($this, $this->model->adicionarMovimientos(
            $this->uiParams['iddocumento'], $this->uiParams['idproductos']
        ));
    }

    /**
     * Elimina los movimientos de un documento dado su identificador.
     * @author Yadrian Aguila
     * @return (lo que retorna)
     */
    public function eliminarMovimientosAction()
    {
        $this->uiParams['idmovimientos'] = (array) Zend_Json::decode($this->uiParams['idmovimientos']);
        $this->model->eliminarMovimientos($this->uiParams['iddocumento'], $this->uiParams['idmovimientos'], false, false);
    }

    /**
     * cargar documentos.
     * @author Yadrian Aguila
     * @return Boolean
     */
    public function cargarConfigAction()
    {
        $this->setDefaultParam('limit', 10);
        $this->setDefaultParam('start', 0);
        $this->objectHelper->synchronize($this, $this->model->cargarConfig($this->uiParams));
    }

    /**
     * Crea un nuevo documento a partir de otro previamente establecido.
     * @author Yadrian Aguila
     * @return Boolean
     */
    public function adicionarConfigAction()
    {
        $this->objectHelper->synchronize($this, $this->model->adicionarConfig($this->uiParams));
    }

    /**
     * Eliminar documento a partir de otro previamente establecido.
     * @author Yadrian Aguila
     * @return Boolean
     */
    public function eliminarConfigAction()
    {
        $this->objectHelper->synchronize($this, $this->model->eliminarConfig($this->uiParams));
    }
}
