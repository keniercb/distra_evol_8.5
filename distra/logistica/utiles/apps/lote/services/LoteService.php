<?php

/**
 * @class DatLoteModel
 * @package Logistica
 * @subpackage Lote
 * @author Dainier Aguila Medina
 * @copyright (c) 2014, XETID
 * @version 1.0
 */
class LoteService extends ZendExt_Model
{
    /**
     * Instancia de la modelo de lote.
     * @var DatLoteModel
     */
    private $model;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->model = new DatLoteModel();
    }

    /**
     * Devuelve un arreglo de lotes.
     * @param array $filtro
     * @param boolean $dql [Opcional] Determina si se devuelve la consulta.
     * @return array|Doctrine_Query
     */
    public function cargarLotes($filtro, $dql)
    {
        return $this->model->cargarLotes($filtro, $dql);
    }

    /**
     * Devuelve un arreglo de lotes con los movlotes.
     * @param array $filtro
     * @param boolean $dql [Opcional] Determina si se devuelve la consulta.
     * @return array|Doctrine_Query
     */
    public function cargarMovLote($filtro, $dql)
    {
        return $this->model->cargarMovLote($filtro, $dql);
    }

    /**
     * Devuelve un arreglo de lotes y sus ubicaciones.
     * @param array $filtro
     * @param boolean $dql [Opcional] Determina si se devuelve la consulta.
     * @return array|Doctrine_Query
     */
    public function cargarUbicacionesLote($filtro, $dql)
    {
        return $this->model->cargarUbicacionesLote($filtro, $dql);
    }

    /**
     * Devuelve un arreglo de lotes y sus ubicaciones.
     * @param array $filtro
     * @param boolean $dql [Opcional] Determina si se devuelve la consulta.
     * @return array|Doctrine_Query
     */
    public function cargarUbicacionesLoteProducto($filtro, $dql)
    {
        return $this->model->cargarUbicacionesLoteProducto($filtro, $dql);
    }

    /**
     * Adiciona o actualiza uno o varios lotes.
     * @param array $datos Arreglo asociativo con los datos de uno o varios lotes.
     * @param array $params Arreglo asociativo con datos adicionales (para guardar varios "collection" = true, 
     * para actualizar el movimiento "actualizarMov" = true, para actualizar disponible del lote "afectaLote" = true,
     * para actualizar disponible del producto "afectaProducto" = true y el signo del movimiento).
     * @return boolean
     */
    public function adicionarLote($datos, $params)
    {
        return $this->model->adicionarLote($datos, $params);
    }

    /**
     * Elimina los movlote dado sus id y el lote correspondiente a cada uno en caso de ser el último de no existir más.
     * @param array $filtro Arreglo asociativo que contiene los datos de los movlote.
     * @param array $datos Arreglo asociativo que contiene datos adicionales 
     * (para actualizar disponible del lote "afectaLote" = true,
     * para actualizar disponible del producto "afectaProducto" = true y el signo del movimiento).
     * @return boolean
     */
    public function eliminarLote($filtro, $datos)
    {
        return $this->model->eliminarLote($filtro, $datos);
    }
    
    /**
     * Elimina los lotes comprometidos de un documento.
     * @param numeric $iddocumento [Opcional]
     * @param numeric|array $idmovimientos [Opcional]
     */
    public function eliminarLotesDocumento($iddocumento, $idmovimientos)
    {
        $this->model->eliminarLotesDocumento($iddocumento, $idmovimientos);
    }

    /**
     * Actualiza la cantidad existente y disponible de los lotes de cada movimiento del documento.
     * @param numeric $iddocumento
     * @param boolean $esEntrada [Opcional] Determina si el documento es una entrada o salida.
     * @param integer $cronologia [Opcional] cronología del documento.
     * @param boolean $anular [Opcional] Detemina si la acción a realizar es anular el documento.
     * @return boolean
     */
    public function actualizarExistenciaLote($iddocumento, $esEntrada = false, $cronologia = 1, $anular = false, $signoMov = false, $afectadisponible = true)
    {
        return $this->model->actualizarExistenciaLote($iddocumento, $esEntrada, $cronologia, $anular, $signoMov, $afectadisponible);
    }

    /**
     * Extrae las cantidades del porducto de las ubicaciones con cantidades disponibles 
     * teniendo en cuenta la fecha de vencimiento.
     * @param array $datos
     * @param boolean $afecta [Opcional] Determina si afecta la cantidad disponible del lote.
     * @param boolean $rotacion [Opcional] Determina si se estraen los lotes rotados.
     * @return array Contiene los detalles de posibles excepciones.
     */
    public function extraerCantidades($datos, $afecta = false, $rotacion = false)
    {
        return $this->model->extraerCantidades($datos, $afecta, $rotacion);
    }

}
