<?php

/**
 * @class GestdocumentoconciliacionController
 * @package Inventario
 * @subpackage Salida
 * @author Daniel Arias Espinosa
 * @copyright XETID
 * @version 1.0
 */
class ConciliacionlogisticaController extends SalidaController
{
    function init()
    {
        $this->arrayData = array('alias' => 'conciliacionLog');
        parent::init('log.inv.documentoconciliacion');
    }

    public function gestdocumentoconciliacionAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.inv.documentoconciliacion');
        $this->renderTemplate();
    }

    public function cargarClientesConTransfereciaAction()
    {

        $valores = $this->model->cargarClientesConTranferecia($this->uiParams);
        $this->datos = $valores['datos'];
        $this->cantidad = $valores['cantidad'];
    }

    public function cargarProductosDocumentoAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->uiParams['iddocumento'] =Zend_Json::decode($this->uiParams['iddocumento']);
        $datosBusqueda = $this->model->devolverTransfConciliacion($this->uiParams);
        $this->datos = $datosBusqueda['datos'];
        $this->cantidad = $datosBusqueda['cantidad'];
    }

    public function cargarTodosUsuariosAction()
    {
        //$this->setDefaultParam('limit', 30);
        //$this->setDefaultParam('start', 0);
        $datosUsuarios = $this->model->devolverTodosUsuarios($this->uiParams);
        $this->datos = $datosUsuarios[0];
        //$this->cantidad = count($datosUsuarios);
    }

    public function cargarDocumentosAction()
    {

        if ($this->uiParams['usuario'] == 1) {
            $this->setDefaultParam('idusuario', $this->uiParams['campousuario']);
        } elseif ($this->uiParams['usuario'] == 2) {
            $this->setDefaultParam('aprobadopor', $this->uiParams['campousuario']);
        } elseif ($this->uiParams['usuario'] == 3) {
            $this->setDefaultParam('conciliadopor', $this->uiParams['campousuario']);
        }
        parent::cargarDocumentosAction();
    }

}
