<?php

/**
 * @class RecepcionController
 * (Descripcion de la clase, objetivo)
 *
 * @package Inventario
 * @subpackage Entrada
 * @author Dainier Aguila Medina
 * @copyright XETID
 * @version 1.0
 */
class RecepcionreservaController extends RecepcionController
{
    function init()
    {
        $this->arrayData = array('reserva' => true);
        parent::init('log.inv.recepcionreserva');
    }

    public function gestrecepcionreservaAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->view->arrayJs = array(
            $this->configuracionHelper->mostrarNomencladoresGenerales(),
            $this->contabilidadHelper->getComprobanteComponent(),
            $this->configuracionHelper->ObtenerJSArbolNaturaleza()
        );
        $this->initComponent('log.inv.recepcionreserva');
        $this->renderTemplate();
    }

    /**
     * Devuelve los productos asociados a un documento según los criterios de búsqueda especificados.
     * @return array
     */
    public function cargarProductosDocumentoAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $query = $this->model->getProductoModel()->devolverMovimientos($this->uiParams, true);
        $datcofubicacion = new UtilesubicacionService();
        $confubic = $datcofubicacion->obtenerConfiguracionUbicacion($this->global->Estructura->idestructura);
        $this->confubicacion = $confubic;
        $this->objectHelper->synchronize($this, $this->model->devolverMovimientos($query, $this->uiParams));
    }

    /**
     * Devuelve un arreglo con los depósitos de la reserva.
     */
    public function cargarDepositosAction()
    {
        $this->objectHelper->synchronize($this, $this->model->cargarDepositos());
    }

}
