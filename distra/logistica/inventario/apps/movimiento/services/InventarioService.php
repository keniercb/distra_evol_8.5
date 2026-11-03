<?php

/**
 * @class MovimientosService
 * Aqui se encuentran todos los servicios de movimiento
 *
 * @copyright XETID
 * @author División de Gestión de Entidades
 * @version 1.0
 */
class InventarioService extends ZendExt_Model
{
    /**
     * @var InventarioModel
     */
    private $model;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->model = new InventarioModel(
            array('alias' => 'inventariogLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_INV)
        );
    }

    /**
     * Devuelve las hojas de inventario.
     * @param array $filtro
     * @param boolean $dql [Opcional]
     * @return array
     */
    public function devolverDocumentos($filtro, $dql = false)
    {
        return $this->model->devolverDocumentos($filtro, $dql);
    }

}
