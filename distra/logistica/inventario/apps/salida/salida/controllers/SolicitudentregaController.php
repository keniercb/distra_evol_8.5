<?php

/**
 * @class SolicitudentregaController
 * (Descripcion de la clase, objetivo)
 * 
 * @package Inventario
 * @subpackage Salida
 * @author Osmel A. Larduet Hechavarría
 * @copyright XETID
 * @version 1.0
 */
class SolicitudentregaController extends SalidaController
{
    private $serviciosCFG;

    public function init()
    {
        $this->arrayData = array('alias' => 'solEntrega');
        parent::init('log.inv.solicitudentrega');
        $this->serviciosCFG = ServiciosConfiguracionGeneralHelper::__init();
    }

    /**
     * (Descripcion de la clase, objetivo)
     */
    public function solicitudentregaAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();

        $this->view->arrayJs = array(
            $this->serviciosCFG->mostrarNomencladoresGenerales(),
            $this->serviciosCFG->ObtenerJSArbolNaturaleza()
        );
        $this->initComponent('log.inv.solicitudentrega');
        $this->rendertemplate();
    }

    

    /**
     * (Descripcion de la clase, objetivo)
     * @return array
     */
    public function adicionarMovimientosAction()
    {
        $this->uiParams['idproductos'] = (array) Zend_Json::decode($this->uiParams['idproductos']);
        $result = $this->model->getProductoModel()->adicionarMovimientos(
            $this->uiParams['iddocumento'], $this->uiParams['idproductos']
        );
        $this->success = (count($result['noadicionados']) == 0);
        $this->nosalvados = count($result['noadicionados']);
    }

    /**
     * @return bool
     */
    public function eliminarDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->model->getProductoModel()->eliminarMovimientos($this->uiParams['iddocumento'], false, false);
        return parent::eliminarDocumentoAction();
    }
}
