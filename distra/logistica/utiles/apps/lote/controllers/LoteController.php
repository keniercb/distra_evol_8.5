<?php

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

/**
 * @class LoteController
 * (Descripcion de la clase, objetivo) *
 * @package Inventario
 * @subpackage Lote
 * @author Dainier Aguila Medina
 * @copyright XETID
 * @version 1.0
 */
class LoteController extends BaseController
{
    /**
     * Instancia de la modelo de lote.
     * @var DatLoteModel
     */
    private $model;

    function init()
    {
        parent::init('log.lb.lote');
        $this->model = new DatLoteModel();
    }

    public function gestloteAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();

        $this->initComponent('log.lb.lote');
        $this->rendertemplate();
    }

    /**
     * Devuelve una colección de lotes.
     * @return array
     */
    public function cargarLotesAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->unsetNullValues();
        $this->uiParams['ubicaciones'] = $this->objectHelper->stdClassToArray(
            Zend_Json::decode($this->uiParams['ubicaciones'])
        );
        $this->objectHelper->synchronize($this, $this->model->cargarLotes($this->uiParams));
    }

    /**
     * Devuelve una colección de lotes con los movlotes.
     * @return array
     */
    public function cargarMovLoteAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->unsetNullValues();
        $this->objectHelper->synchronize($this, $this->model->cargarMovLote($this->uiParams));
    }

    /**
     * Devuelve una colección de lotes y sus ubicaciones.
     * @return array
     */
    public function cargarUbicacionesLoteAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->unsetNullValues();
        $this->objectHelper->synchronize($this, $this->model->cargarUbicacionesLote($this->uiParams));
    }

    /**
     * Adiciona un lote.
     * @return numeric
     */
    public function adicionarLoteAction()
    {
        $this->uiParams['data'] = $this->objectHelper->stdClassToArray(Zend_Json::decode($this->uiParams['data']));
        $this->uiParams['datos'] = (array) Zend_Json::decode($this->uiParams['datos']);
        $this->unsetNullValues();
        $this->objectHelper->synchronize(
            $this, $this->model->adicionarLote($this->uiParams['data'], $this->uiParams['datos'])
        );
    }

    /**
     * Registra uno o varios "movlote" y actualiza el movimiento correspondiente.
     * @return boolean
     */
    public function salvarMovimientoAction()
    {
        $this->uiParams['data'] = $this->objectHelper->stdClassToArray(Zend_Json::decode($this->uiParams['data']));
        $this->uiParams['datos'] = (array) Zend_Json::decode($this->uiParams['datos']);
        $this->unsetNullValues();
        $this->objectHelper->synchronize(
            $this, $this->model->adicionarLote($this->uiParams['data'], $this->uiParams['datos'])
        );
    }

    /**
     * Elimina el lote seleccionado.
     * @return boolean
     */
    public function eliminarLoteAction($filtro)
    {
        $this->uiParams['data'] = $this->objectHelper->stdClassToArray(Zend_Json::decode($this->uiParams['data']));
        $this->uiParams['datos'] = (array) Zend_Json::decode($this->uiParams['datos']);
        $this->unsetNullValues();

        $this->success = $this->model->eliminarLote($this->uiParams['data'], $this->uiParams['datos']);
    }

    /**
     * Devuelve una colección de proveedores.
     * @return array
     */
    public function cargarComboFabricanteAction()
    {
        $datos = $this->configuracionHelper->getClientesProveedorByParams(
            null, $this->global->Estructura->idestructura, true, false, true, null, $this->uiParams['start'],
            $this->uiParams['limit']
        );
        $this->datos = $datos['datos'];
        $this->total = $datos['cantidad'];
    }

    /**
     * Devuelve una colección de países.
     * @return array
     */
    public function cargarComboPaisAction()
    {
        $this->datos = $this->configuracionHelper->obtenerPaisesEntidad($this->global->Estructura->idestructura);
    }

    public function getProductosDocumentoAction()
    {
        $result = $this->model->getProductosDocumento($this->uiParams);
        $this->datos = $result;
        $this->cantidad = $result[0] ? $result[0]['cantidad'] : 0;
        $this->total = $result[0] ? $result[0]['cantidad'] : 0;
    }

    /**
     * Devuelve un arreglo de ubicacionaes del lote.
     * @return array
     */
    public function cargarComboUbicacionAction()
    {
        $this->autoShow = false;
        echo json_encode($this->model->cargarComboUbicaciones($this->uiParams));
    }

}
