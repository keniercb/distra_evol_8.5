<?php

/**
 * @class      TransferenciareaController
 * (Descripcion de la clase, objetivo)
 *
 * @package    Inventario
 * @subpackage Movimiento
 * @author     Manuel Yhon Figueroa y Antonio Diaz Soutuyo
 * @copyright  XETID
 * @version    1.0
 */
class TransferenciareaController extends MovimientosController
{
    public function init()
    {
        $this->arrayData = array('alias' => 'transferenciareaLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_INV);
        parent::init('log.inv.transferenciarea');
    }

    public function transferenciareaAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->view->arrayJs = array(
            $this->servConfGeneral->mostrarNomencladoresGenerales(),
            $this->servConfGeneral->ObtenerJSArbolNaturaleza()
        );
        $this->initComponent('log.inv.transferenciarea');
        $this->renderTemplate();
    }

    public function cargarMovTransferenciaAction()
    {
        $this->unsetNullValues();
        $this->objectHelper->synchronize($this, $this->model->cargarMovTransferencia($this->uiParams));
    }

    public function adicionarMovTransferenciaAction()
    {
        $this->unsetNullValues();
        $this->objectHelper->synchronize($this, $this->model->adicionarMovTransferencia($this->uiParams));
    }

    /**
     * Cargar los combobox de las areas de origen y destino
     * @return array
     */
    public function cargarAreasOrigenDestinoAction()
    {
        $this->datos = $this->model->cargarAreasOrigenDestino($this->uiParams['iddeposito']);
    }

    /**
     * Carga los combobox de las areas origen y destino
     * por una transferencia entre areas
     * @return array
     */
    public function cargarAreasXTipoTransferenciaAction()
    {
        $this->datos = $this->model->cargarAreasXTipoTransferencia($this->uiParams['iddeposito']);
    }

    public function cargarArbolOrigenAction()
    {
        $this->objectHelper->synchronize($this, $this->model->obtenerUbicacionProducto($this->uiParams));
    }

    public function cargarArbolDestinoAction()
    {
        $this->objectHelper->synchronize($this, $this->model->obtenerUbicacionDestino($this->uiParams));
    }
}