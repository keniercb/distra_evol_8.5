<?php

/**
 * @class RecepcionService
 * Aquí se encuentran todos los servicios de informe de recepción.
 * @copyright XETID
 * @author División de Gestión de Entidades
 * @version 1.0
 */
class RecepcionService extends ZendExt_Model
{
    /**
     * @var RecepcionModel
     */
    private $model;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->model = new RecepcionModel(
            array('alias' => 'recepcionLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_INV)
        );
    }

    /**
     * Devuelve los informes de recepción.
     * @param array $datosDoc
     * @param boolean $dql
     * @return array|Doctrine_Query
     */
    public function devolverDocumentos($datosDoc, $dql = false)
    {
        return $this->model->devolverDocumentos($datosDoc, $dql);
    }

    /**
     * Adiciona un documento de apertura.
     * @param Array $datosDoc Arreglo de datos del documento con sus preductos.
     * @return integer
     */
    public function adicionarDocumento($datosDoc)
    {
        return $this->model->adicionarDocumento($datosDoc);
    }

}
