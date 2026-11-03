<?php

/**
 * @class ReclamacionService
 * Aquí se encuentran todos los servicios de informe de diferencia.
 * @copyright XETID
 * @author División de Gestión de Entidades
 * @version 1.0
 */
class ReclamacionService extends ZendExt_Model
{
    private $model;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->model = new ReclamacionModel(
            array('alias' => 'informediferenciaLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_INV)
        );
    }

    /**
     * Devuelve los informes de diferencia.
     * @param array $datosDoc
     * @param boolean $dql
     * @return array
     */
    public function devolverDocumentos($datosDoc, $dql = false)
    {
        return $this->model->devolverDocumentos($datosDoc, $dql);
    }

    /**
     * @param array $filtro
     * @return array
     */
    public function cargarDiferenciasXCantidad($filtro)
    {
        return $this->model->cargarDiferenciasXCantidad($filtro);
    }

    /**
     * @param numeric $idmovimiento
     * @return array
     */
    public function cargarDiferenciasXCalidad($idmovimiento)
    {
        return $this->model->cargarDiferenciasXCalidad($idmovimiento);
    }

    /**
     * Registra las diferencias de los movimientos.
     * @param array $datos
     * @param boolean $varios [Opcional] Determina si se registra diferencias a varios movimientos.
     * @return boolean
     */
    public function registrarDiferencias($datos, $varios = false)
    {
        return $this->model->registrarDiferencias($datos, $varios);
    }

    public function adicionarDocumento($datos)
    {
        return $this->model->adicionarDocumento($datos);
    }

}
