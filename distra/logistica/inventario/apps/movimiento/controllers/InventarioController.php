<?php

/**
 * @class InventarioController
 * (Descripcion de la clase, objetivo)
 *
 * @package Inventario
 * @subpackage Movimiento
 * @author Manuel Yhon Figuera y Antonio Diaz Soutuyo
 * @copyright XETID
 * @version 1.0
 */
class InventarioController extends MovimientosController
{

    public function init()
    {
        $this->arrayData = array('alias' => 'inventariogLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_INV);
        parent::init('log.inv.hojainventario');
    }

    public function inventarioAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->view->arrayJs = array(
            $this->servConfGeneral->mostrarNomencladoresGenerales(),
            $this->servConfGeneral->ObtenerJSArbolNaturaleza()
        );
        $this->initComponent('log.inv.hojainventario');
        $this->renderTemplate();
    }

    /**
     * Funcion que permite cargar las areas de un deposito
     * @params array $data Arreglo con el parametro iddeposito
     * @return array
     */
    public function cargarAreasAction()
    {
        $params = $this->uiParams;
        $this->datos = $this->model->cargarAreas($params['iddeposito']);
    }

    /**
     * Funcion que permite cargar las naturalezas
     * @return void
     */
    public function cargarNaturalezaAction()
    {
        $params = $this->uiParams;
        $this->datos = $this->model->cargarNaturaleza($params['idarea']);
    }

    /**
     * Funcion que permite cargar los meses en que no se
     * ha terminado de realizar el plan de conteo
     * @return void
     */
    public function cargarMesesInventariarAction()
    {
        $params = $this->uiParams;
        $this->datos = $this->model->cargarMesesInventariar($params['idestructuracomun']);
    }

    /**
     * Funcion que permite cargar los años en que no se
     * ha terminado de realizar el plan de conteo
     * @return void
     */
    public function cargarAnnosInventariarAction()
    {
        $this->datos = $this->model->cargarAnnosInventariar();
    }

    public function adicionarDocumentoAction()
    {
        $this->uiParams['idindicador'] = (array)Zend_Json::decode($this->uiParams['idindicador']);
        $this->uiParams['data'] = (array)Zend_Json::decode($this->uiParams['data']);
        $this->uiParams['idproductos'] = (array)Zend_Json::decode($this->uiParams['idproductos']);
        $this->uiParams = array_merge($this->uiParams, $this->uiParams['data']);
        unset($this->uiParams['data']);
        $this->objectHelper->synchronize($this, $this->model->adicionarDocumento($this->uiParams));
//        $tipo = $this->uiParams['tipoinventario'];

//        if ($tipo == InventarioModel::TIPO_INV_DIARIO || $tipo == InventarioModel::TIPO_INV_GENERAL ||
//            $tipo = InventarioModel::TIPO_INV_MENSUAL) {
//            $this->reloadGridDetalle = 1;
//        }
    }

    public function adicionarMovimientosAction()
    {
        $this->uiParams['idproductos'] = (array) Zend_Json::decode($this->uiParams['idproductos']);
        $this->uiParams['idindicador'] = (array) Zend_Json::decode($this->uiParams['idindicador']);
//        if ($this->uiParams['idindicador']) {
//            $this->objectHelper->synchronize($this, $this->model->adicionarDocumento($this->uiParams));
//        } else {
        $movimientos = $this->model->adicionarMovimientos($this->uiParams);
        $this->model->adicionarMovLotes($movimientos, $this->uiParams['idarea']);
//        $this->success = (count($result['noadicionados']) == 0);
//        $this->nosalvados = count($result['noadicionados']);
        $this->cantproductos = $this->model->cantidadMovimientos($this->uiParams['iddocumento']);
//        }
    }

    public function actualizarConteoAction()
    {
        $this->uiParams['idmovimientos'] = (array) Zend_Json::decode($this->uiParams['idmovimientos']);
        $this->uiParams['idproductos'] = (array) Zend_Json::decode($this->uiParams['idproductos']);
        $this->datos = $this->model->actualizarConteo($this->uiParams);
    }

    public function guardarConteoLoteAction()
    {
        $this->uiParams['datos'] = (array) Zend_Json::decode($this->uiParams['datos']);
        $this->uiParams['params'] = (array) Zend_Json::decode($this->uiParams['params']);
        $this->datos = $this->model->guardarConteoLote($this->uiParams);
    }
}
