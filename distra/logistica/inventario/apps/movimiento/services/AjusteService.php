<?php

/**
 * @class MovimientosService
 * Aqui se encuentran todos los servicios de movimiento
 *
 * @copyright XETID
 * @author División de Gestión de Entidades
 * @version 1.0
 */
class AjusteService extends ZendExt_Model
{
    /**
     * @var AjusteModel
     */
    private $model;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->model = new AjusteModel(array('alias' => 'ajusteLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_INV));
    }

    /**
     * Devuelve los ajustes de inventario.
     * @param array $filtro
     * @param boolean $dql
     * @return array|Doctrine_Query
     */
    public function devolverDocumentos($filtro, $dql = false)
    {
        return $this->model->devolverDocumentos($filtro, $dql);
    }

    /**
     * Devuelve los movimientos del ajuste de inventario.
     * @param array $filtro
     * @param boolean $dql
     * @return array|Doctrine_Query
     */
    public function devolverMovimientos($filtro, $dql = false)
    {
        return $this->model->devolverMovimientos($filtro, $dql);
    }
    
    /**
     * Devuelve el/los idoperacion dado un/varios código(s).
     * @param string|array $codigo
     * @param numeric $idestructura [Opcional]
     * @param numeric $iddoc [Opcional]
     * @return numeric
     */
    public function getIdOperacion($codigo, $idestructura = null, $iddoc = null)
    {
        return $this->model->getIdOperacion($codigo, $idestructura, $iddoc);
    }

}
