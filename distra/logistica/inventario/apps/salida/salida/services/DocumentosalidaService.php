<?php

/**
 * @class DocumentosalidaService
 * Aquí se encuentran todos los servicios de documento de salida
 * @copyright XETID
 * @author División de Gestión de Entidades
 * @version 1.0
 */
class DocumentosalidaService extends BaseModel
{
    /**
     * @var DocumentosalidaModel
     */
    private $model;

    public function __construct($idsubsistema = false)
    {
		
		parent::__construct();
        JSONComponent::__init()->loadDefinitionsFile('cmp.definitions')->buildComponent('log.inv.documentosalida');
        $this->model = new DocumentosalidaModel(
            array('alias' => 'valeLog', 'subsistema' => ($idsubsistema) ? $idsubsistema: LogisticaGlobal::SUBSISTEMA_INV)
        );
    }

    /**
     * Devuelve los documento de salida.
     * @param array $filtro Filtro de búsqueda.
     * @param boolean $dql [Opcional] Determina si se devuelve la consulta.
     * @return array|Doctrine_Query
     */
    public function devolverDocumentos($filtro, $dql, $idestructuraOpcional, $idoperacionOpcional)
    {
        return $this->model->devolverDocumentos($filtro, $dql, $idestructuraOpcional, $idoperacionOpcional);
    }

    /**
     * Devuelve los movimientos de "vale de entrega".
     * @param array $filtro
     * @return array
     */
    public function devolverMovimientosDoc($filtro)
    {
        return $this->model->devolverMovValeEntrega($filtro);
    }

    /**
     * Devuelve los productos de "vale de entrega".
     * @param array $filtro Filtro de búsqueda.
     * @param boolean $dql [Opcional] Determina si se devuelve la consulta.
     * @return array
     */
    public function devolverProductosDoc($filtro, $dql)
    {
        return $this->model->devolverProductosDoc($filtro, $dql);
    }

    /**
     * Devuleve los clientes con las cantidades de transferencias.
     * @param array $filtro
     * @return array
     */
    public function devolverClientesTransferencias($filtro)
    {
        return $this->model->devolverClientesTransferencias($filtro);
    }

    /**
     * Devuelve las transferencias asociadas a un cliente.
     * @param array $filtros
     * @return array
     */
    public function devolverTransfereciasQuery($query, $alias, $aliasDocumento = 'd')
    {
        return $this->model->devolverTransfereciaQuery($query, $alias, $aliasDocumento);
    }

    /**
     * 
     * @param array $param Arreglo de iddocumento por el cual se realizará la búsqueda.
     * @return array
     */
    public function devolverDatosByDoc($param)
    {
        return $this->model->devolverDatosByDoc($param);
    }

    /**
     * Actualiza el cumplimiento de los productos de la órden de despacho especificado.
     * @param array $datos
     * @param integer $cantidad
     * @param boolean $borrar [Opcional]
     * @return boolean
     */
    public function actualizarCumplimientoProdOrden($datos, $cantidad, $borrar = false)
    {
        return $this->model->actualizarCumplimientoProdOrden($datos, $cantidad, $borrar);
    }

    /**
     * Actualiza el cumplimiento de los productos de la solicitud de entrega especificado.
     * @param array $datos
     * @param integer $cantidad
     * @param boolean $borrar [Opcional]
     * @return boolean
     */
    public function actualizarCumplimientoSolEntrega($datos, $cantidad, $borrar = false)
    {
        return $this->model->actualizarCumplimientoSolEntrega($datos, $cantidad, $borrar);
    }

}
