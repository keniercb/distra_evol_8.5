<?php

/**
 * @class     MenualimentoService
 * Aqui se encuentran todos los servicios del menú de alimentos
 * @copyright XETID
 * @author    División de Gestión de Entidades
 * @version   1.0
 */
class MenualimentoService extends ZendExt_Model
{

    private $model;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->model = new MenualimentoModel(
            array('alias' => 'menuAlim', 'subsistema' => LogisticaGlobal::SUBSISTEMA_INV, 'isPrincipal'=>false)
        );
    }

    /**
     * Devuelve los menú de alimentos.
     * @param array $datosDoc
     * @param boolean $dql [Opcional]
     * @return array|Doctrine_Query
     */
    public function devolverDocumentos($datosDoc, $dql)
    {
        return $this->model->devolverDocumentos($datosDoc, $dql);
    }

    /**
     * Devuelve los productos de varios documentos dado un centro de costo.
     * @param array $filtro
     * @param boolean $dql [Opcional]
     * @return array|Doctrine_Query
     */
    public function devolverProductoByCliente($filtro, $dql)
    {
        return $this->model->obtenerProductos($filtro, $dql);
    }
    
}
