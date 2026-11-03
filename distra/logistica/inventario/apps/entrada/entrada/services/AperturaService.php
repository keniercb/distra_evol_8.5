<?php

/**
 * @class AperturaService
 * Aquí se encuentran todos los servicios de informe de recepción.
 * @copyright XETID
 * @author División de Gestión de Entidades
 * @version 1.0
 */
class AperturaService extends ZendExt_Model
{
    private $model;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->model = new AperturaModel(
            array('alias' => 'aperturaLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_INV)
        );
    }

    /**
     * Devuelve las aperturas.
     * @param array $datosDoc
     * @param boolean $dql
     * @return array
     */
    public function devolverDocumentos($datosDoc, $dql = false)
    {
        return $this->model->devolverDocumentos($datosDoc, $dql);
    }

    /**
     * Aprueba el documento de apertura.
     * @param numeric $iddocumento
     * @return boolean
     */
    public function aprobarDocumentos($iddocumento)
    {
        return $this->model->aprobarDocumento($iddocumento);
    }

    /**
     * Verifica si todos los documentos de apertura están aprobados.
     * @return boolean
     */
    public function existenTodosAprobados()
    {
        return $this->model->existenTodosAprobados();
    }

    public function abrirDeposito($iddocumento)
    {
        return $this->model->abrirDeposito($iddocumento);
    }

}
