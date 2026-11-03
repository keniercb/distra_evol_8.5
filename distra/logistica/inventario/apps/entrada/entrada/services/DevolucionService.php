<?php

/**
 * @class AperturaService
 * Aquí se encuentran todos los servicios de informe de recepción.
 * @copyright XETID
 * @author División de Gestión de Entidades
 * @version 1.0
 */
class DevolucionService extends ZendExt_Model
{
    private $model;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->model = new DevolucionModel(
            array('alias' => 'valedev', 'subsistema' => LogisticaGlobal::SUBSISTEMA_INV)
        );
    }

    /**
     * Actualiza el cumplimiento de devolución de los productos del documento.
     * @param numeric $iddocumento
     * @param boolean $borrar [Opcional]
     * @param array $idmovimientos [Opcional]
     * @return boolean
     */
    public function actualizarProductoCmplto($iddocumento, $borrar = false, $idmovimientos = array())
    {
        return $this->model->actualizarProductoCmplto($iddocumento, $borrar, $idmovimientos);
    }

}
