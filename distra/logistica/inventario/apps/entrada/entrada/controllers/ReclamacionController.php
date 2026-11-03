<?php

/**
 * @class ReclamacionController
 * (Descripcion de la clase, objetivo)
 *
 * @package Inventario
 * @subpackage Entrada
 * @author Dainier Aguila Medina
 * @copyright XETID
 * @version 1.0
 */
class ReclamacionController extends EntradasController
{
    function init()
    {
        $this->arrayData = array('alias' => 'informediferenciaLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_INV);
        parent::init('log.inv.reclamacion');
    }

    public function gestreclamacionAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->view->arrayJs = array(
            $this->configuracionHelper->mostrarNomencladoresGenerales(),
            $this->configuracionHelper->ObtenerJSArbolNaturaleza()
        );
        $this->initComponent('log.inv.reclamacion');
        $this->rendertemplate();
    }

    /**
     * Devuelve los productos asociados a un documento.
     * @author Kenier Cumba Bueno
     * @return Array
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

    /**
     * Adiciona los movimientos asociados a un documento.
     * @return array
     */
    public function adicionarMovimientosAction()
    {
        $this->uiParams['idproductos'] = $this->objectHelper->stdClassToArray(
            Zend_Json::decode($this->uiParams['idproductos'])
        );
        $result = $this->model->getProductoModel()->adicionarMovimientos(
            $this->uiParams['iddocumento'], $this->uiParams['idproductos'], LogisticaMovimientoModel::SIGNO_NINGUNO
        );
        $this->success = (count($result['noadicionados']) == 0);
        $this->nosalvados = count($result['noadicionados']);
    }

    /**
     * Devuelve los clientes por su id.
     * @return array
     */
    public function cargarClienteByIdAction()
    {
        $filtro[] = array('idcliente' => $this->uiParams['idcliente'], 'tipocliente' => $this->uiParams['tipocliente']);
        $datosBusqueda = $this->model->cargarClientesDocumentos($filtro);
        $this->datos = $datosBusqueda;
    }

    /**
     * Devuelve los informes de recepción.
     * @return array
     */
    public function cargarDocRecepcionAction()
    {
        $recp = new RecepcionService();
        $datosBusqueda = $recp->devolverDocumentos($this->uiParams);
        $this->datos = $datosBusqueda['datos'];
        $this->cantidad = $datosBusqueda['cantidad'];
    }

}
