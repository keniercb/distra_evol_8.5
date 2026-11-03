<?php

/**
 * @class DevolucionController
 * (Descripción de la clase, objetivo)
 *
 * @package Inventario
 * @subpackage Entrada
 * @author Dainier Aguila Medina
 * @copyright XETID
 * @version 1.0
 */
class DevolucionController extends EntradasController
{
    function init()
    {
        $this->arrayData = array('alias' => 'valedev', 'subsistema' => LogisticaGlobal::SUBSISTEMA_INV);
        parent::init('log.inv.devolucion');
        $facturacion = LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_FAC);
        $this->view->uiVariables = array_merge(
            array('facturacion' => json_encode($facturacion)), $this->view->uiVariables
        );
    }

    public function gestdevolucionAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->view->arrayJs = array(
            $this->configuracionHelper->mostrarNomencladoresGenerales(),
            $this->configuracionHelper->ObtenerJSArbolNaturaleza()
        );
        $this->initComponent('log.inv.devolucion');
        $this->rendertemplate();
    }

    /**
     * Devuelve los productos asociados a un documento según los criterios de búsqueda especificados.
     * @return array
     */
    public function cargarProductosDocumentoAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->objectHelper->synchronize($this, $this->model->devolverMovimientos($this->uiParams));
        $datcofubicacion = new UtilesubicacionService();
        $confubic = $datcofubicacion->obtenerConfiguracionUbicacion($this->global->Estructura->idestructura);
        $this->confubicacion = $confubic;
    }

    /**
     * Genera un vale de devolución a partir de un vale de entrega o una factura.
     * @return integer Id del documento.
     */
    public function generarDocumentoAction()
    {
        $this->uiParams['data'] = $this->objectHelper->stdClassToArray(Zend_Json::decode($this->uiParams['data']));
        $this->objectHelper->synchronize($this, $this->model->generarDocumento($this->uiParams['data']));
    }

    /**
     * Elimina los movimientos de un vale de devolución dado su identificador.
     * @author Kenier Cumba Bueno
     * @return (lo que retorna)
     */
    public function eliminarMovimientosAction()
    {
        $this->uiParams['idmovimientos'] = (array) Zend_Json::decode($this->uiParams['idmovimientos']);
        $this->model->eliminarMovimientos($this->uiParams['idmovimientos']);
    }

    /**
     * Devuelve una colección de centros de costo.
     * @return array
     */
    public function cargarComboCentroCostoAction()
    {
        $centroCosto = ServiciosContabilidadFinanzasHelper::__init();
        $this->datos = $centroCosto->obtenerCentrosCosto($this->global->Estructura->idestructura);
    }

    /**
     * Devuelve los vales de entrega.
     * @return array
     */
    public function cargarDocSalidaAction()
    {
        $this->objectHelper->synchronize($this, $this->model->cargarDocSalida($this->uiParams));
    }

    /**
     * Devuelve las facturas.
     * @return array
     */
    public function cargarDocFacturaAction()
    {
        $datos = $this->model->cargarDocFactura($this->uiParams);
        $this->datos = $datos['datos'];
        $this->cantidad = $datos['cantidad'];
    }

    /**
     * Devuelve una colección de lotes del producto.
     * @return array
     */
    public function cargarLotesAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->unsetNullValues();
        $this->objectHelper->synchronize($this, $this->model->cargarLotes($this->uiParams));
    }

    /**
     * Devuelve una colección de lotes con los movlotes del producto.
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
     * Devuelve los tipos de documentos.
     * @return array
     */
    public function cargarTipoDocAction()
    {
        $datos = $this->model->devolverTipoDocumento();
        $this->datos = $datos;
        $this->cantidad = count($datos);
    }
    
    public function cargarComboTipoDocumentoAction()
    {
        $this->datos = $this->model->cargarComboTipoDocumento();
    }

}
