<?php

/**
 * @class SolicitudentregaService
 * Aquí se encuentran todos los servicios de solicitud de entrega
 * @copyright XETID
 * @author División de Gestión de Entidades
 * @version 1.0
 */
class SolicitudentregaService extends ZendExt_Model
{
    private $model;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->model = new SolicitudentregaModel(
            array('alias' => 'solEntrega', 'subsistema' => LogisticaGlobal::SUBSISTEMA_INV, 'isPrincipal'=>false)
        );
    }

    /**
     * Devuelve las solicitudes de entrega.
     * @param array $datosDoc
     * @param boolean $dql [Opcional]
     * @return array|Doctrine_Query
     */
    public function devolverDocumentos($datosDoc, $dql)
    {
        return $this->model->devolverDocumentos($datosDoc, $dql);
    }

    /**
     * Adicionar documentos de solicitudes.
     * @param array $datosDoc
     * @param boolean $dql [Opcional]
     * @return array|Doctrine_Query
     */
    public function adicionarDocumento($datosDoc)
    {
        return $this->model->adicionarDocumento($datosDoc);
    }

}
