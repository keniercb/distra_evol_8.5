<?php

/**
 * @class AperturaController
 * (Descripcion de la clase, objetivo)
 *
 * @package Inventario
 * @subpackage Entrada
 * @author Dainier Aguila Medina
 * @copyright XETID
 * @version 1.0


 */
class AperturaController extends EntradasController
{

    function init()
    {
        $this->arrayData = $this->arrayData ? $this->arrayData : array('alias' => 'aperturaLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_INV);
        parent::init('log.inv.apertura');
        $array = array(
            'cargaInicial' => $this->configuracionHelper->subsistemaAperturado($this->global->Estructura->idestructura,
                LogisticaGlobal::SUBSISTEMA_INV)
        );
        $this->view->uiVariables = array_merge($array, $this->view->uiVariables);
    }

    public function gestaperturaAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->view->arrayJs = array(
            $this->configuracionHelper->mostrarNomencladoresGenerales(),
            $this->configuracionHelper->ObtenerJSArbolNaturaleza(),
            $this->configuracionHelper->ObtenerJSArbolUM()
        );
        $this->initComponent('log.inv.apertura');
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
     * Adicionar un documento.
     * @author Kenier Cumba Bueno
     * @return Numeric
     */
    public function adicionarDocumentoAction()
    {
        $this->uiParams['data'] = $this->objectHelper->stdClassToArray(Zend_Json::decode($this->uiParams['data']));
        $this->uiParams['tarjeta'] = $this->objectHelper->stdClassToArray(
            Zend_Json::decode($this->uiParams['tarjeta'])
        );
        $this->uiParams['arridindicador'] = $this->objectHelper
            ->stdClassToArray(Zend_Json::decode($this->uiParams['arridindicador']));
        if(count($this->uiParams['arridindicador'])){
            $this->uiParams['tarjeta'] = $this->uiParams['arridindicador'];
        }
        $this->uiParams['idproductos'] = $this->objectHelper->stdClassToArray(
            Zend_Json::decode($this->uiParams['idproductos'])
        );
        $this->uiParams = array_merge($this->uiParams, $this->uiParams['data']);
        unset($this->uiParams['data']);
        $this->unsetNullValues();
        $this->objectHelper->synchronize($this, $this->model->adicionarDocumento($this->uiParams));
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
    }
    
    public function cargarProductoErrorAction()
    {
        $this->setDefaultParam('start', 0);
        $this->setDefaultParam('limit', 30);
        $this->objectHelper->synchronize($this, $this->model->cargarProductoError($this->uiParams));
    }
    
    public function eliminarImportarAction()
    {
        $this->objectHelper->synchronize($this, $this->model->eliminarImportar($this->uiParams['iddocumento']));
    }

}
