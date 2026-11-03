<?php

/**
 * @class AjusteController
 * (Descripcion de la clase, objetivo)
 *
 * @package Inventario
 * @subpackage Movimiento
 * @author Manuel Yhon Figueroa
 * @copyright XETID
 * @version 1.0
 */
class AjusteController extends MovimientosController
{
    public function init()
    {
        $this->arrayData = array('alias' => 'ajusteLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_INV);
        parent::init('log.inv.ajuste');
    }

    public function ajusteAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->view->arrayJs = array(
            $this->servConfGeneral->mostrarNomencladoresGenerales(),
            $this->servConfGeneral->ObtenerJSArbolNaturaleza()
        );
        $this->initComponent('log.inv.ajuste');
        $this->renderTemplate();
    }

    /**
     * Metodo para cargar las operaciones de ajuste
     * @return array
     */
    public function cargaMotivoAjusteAction()
    {
        $this->datos = $this->model->cargaMotivoAjuste();
    }

    public function adicionarMovimientosAction()
    {
        $this->uiParams['idproductos'] = (array) Zend_Json::decode($this->uiParams['idproductos']);
        $this->objectHelper->synchronize(
            $this, $this->model->adicionarMovimientos(
                $this->uiParams['iddocumento'], $this->uiParams['idproductos'], $this->uiParams['idoperacion'], 
                $this->uiParams['concantidad']
            )
        );
    }

    public function guardarConteoLoteAction()
    {
        $this->uiParams['datos'] = (array) Zend_Json::decode($this->uiParams['datos']);
        $this->uiParams['data'] = (array) Zend_Json::decode($this->uiParams['data']);
        $this->uiParams['cantidad'] = (array) Zend_Json::decode($this->uiParams['cantidad']);
        $this->datos = $this->model->guardarConteoLote($this->uiParams);
    }

    public function verificarUbicacionesAction()
    {
        $this->uiParams['datos'] = (array) Zend_Json::decode($this->uiParams['datos']);
        $result = $this->model->contieneUbicacionProducto($this->uiParams);
        $this->ubicaciones = $result['ubicaciones'];
    }
    
    public function cargarUsuariosAction()
    {
        $this->datos = $this->model->devolverUsuarios($this->uiParams['campo']);
    }

    public function ajustarCeroAction()
    {
        $this->success = $this->model->ajustarCero($this->uiParams['iddeposito']);
    }

}
