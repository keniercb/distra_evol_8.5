<?php

class NoSerieService extends ZendExt_Model
{

    /**
     * Modelo de numero de serie.
     * @var LogisticaNumeroSerieModel
     */
    private $noSerie;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->noSerie = new LogisticaNumeroSerieModel();
    }
    
    /**
     * Devuelve los numeros de serie.
     * @param array $filtro
     * @param boolean $dql
     * @return array|Doctrine_Query
     */
    public function cargarNroSerie($filtro, $dql = false)
    {
        return $this->noSerie->cargarNroSerie($filtro, $dql);
    }
    
    /**
     * Adiciona los numeros de serie aperturados y recepcionados.
     * @param array $datos
     * @param boolean $actualizar [Opcional] Determina si actualiza el movimiento.
     * @return boolean
     */
    public function adicionarNumeroserie($datos, $actualizar = true)
    {
        return $this->noSerie->adicionarNumeroserie($datos, $actualizar);
    }
    
    /**
     * Elimina los numeros de serie de un documento o movimientos de entrada eliminados.
     * @param numeric $iddocumento
     * @param array $idmovimientos
     * @param boolean $esSalida [Opcional]
     * @return boolean
     */
    public function eliminarNrosCancelados($iddocumento, $idmovimientos, $esSalida = false)
    {
        return $this->noSerie->eliminarNrosCancelados($iddocumento, $idmovimientos, $esSalida);
    }

    /**
     * Actualiza el estado de los numeros de serie de un documento.
     * @param numeric $iddocumento
     * @param boolean $cancelar
     * @param boolean $baja
     * @return boolean
     */
    public function actualizarEstadoNumeroSerie($iddocumento, $cancelar = false, $baja = false)
    {
        return $this->noSerie->actualizarEstadoNumeroSerie($iddocumento, $cancelar, $baja);
    }

    public function getNumerosSeriesDisponibles($params){
        return $this->noSerie->getNumerosSeriesDisponibles($params);
    }

    public function cambiaEstadoFacturacion($idmovimiento){
        return $this->noSerie->cambiaEstadoFacturacion($idmovimiento);
    }

    public function getNumerosEnDoc($idsdocumentos){
        return $this->noSerie->getNumerosEnDoc($idsdocumentos);
    }

}