<?php

/**
 * Description of DocumentosLogisticaController
 *
 * @author Kenier Cumba Bueno
 */
class DocumentologisticaController extends BaseController
{

    protected $model;

    public function init()
    {
        parent::init('log.lb.documento');
        $this->model = new DocumentoLogisticaModel(
            array(
                'noexception' => $this->uiParams['exception'],
                'alias'       => $this->uiParams['alias'],
                'subsistema'  => $this->uiParams['subsistema']
            )
        );
    }

    function documentoLogisticaAction()
    {
        $this->autoShow = false;
    }

    public function cargarUsuariosAction()
    {
        $this->datos = $this->model->devolverUsuarios($this->uiParams['campo']);
    }

    public function cargarTipoDocumentoAction()
    {
        $this->datos = $this->model->devolverTipoDocumento();
    }

    public function cargaInicialAction()
    {
        $this->datos = $this->model->cargaInicial();
    }

    public function cargarEncabezadoAction()
    {
        if (!empty($this->uiParams['iddocumento'])) {
            $this->datos = $this->model->cargarEncabezado($this->uiParams['iddocumento']);
        }
    }
    public function salvarObservacionesAction()
    {
        $this->model->salvarObservaciones($this->uiParams);
    }
    public function eliminarObservacionesAction()
    {
        $this->model->eliminarObservaciones($this->uiParams);
    }

    public function cargarObservacionesAction()
    {
        $datos = $this->model->devolverObservaciones($this->uiParams);
        $this->datos = $datos['datos'];
        $this->cantidad = $datos['cantidad'];
    }

    public function firmarDocumentoAction()
    {
        $this->objectHelper->synchronize($this,$this->model->firmarDocumento($this->uiParams));
    }

    public function descargarDocumentoAction()
    {
        $this->autoShow = false;
        return $this->model->descargarDocumento($this->uiParams);
    }

    public function setFirmasAction(){
        $this->uiParams = $this->objectHelper->stdClassToArray(Zend_Json::decode($this->uiParams['data']));
        $this->model->salvarFirmasDocumentos($this->uiParams);
    }

    public function setFirmasPorDefectoAction() {
        $this->uiParams = $this->objectHelper->stdClassToArray(Zend_Json::decode($this->uiParams['data']));
        $this->model->salvarFirmasPorDefecto($this->uiParams);
    }

    public function getFirmasPorDefectoAction() {
        $this->uiParams = $this->objectHelper->stdClassToArray(Zend_Json::decode($this->uiParams['data']));
        $this->model->cargarFirmasPorDefecto($this->uiParams);
        $this->objectHelper->synchronize($this, $this->model->cargarFirmasPorDefecto($this->uiParams));
    }

    public function bloquearDocumentoAction()
    {
        $this->success = $this->model->bloquearDocumento(json_decode($this->uiParams['id'])[0], $this->uiParams['accion']);
    }

    public function getIdentificadorAction() {
        $this->datos = $this->model->getIdentificador(json_decode($this->uiParams['iddocumento']));
    }
}
