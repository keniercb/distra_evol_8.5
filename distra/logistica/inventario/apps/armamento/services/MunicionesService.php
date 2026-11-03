<?php

/**
 * @class MunicionesService
 * Servicios de municiones.
 * @copyright XETID
 * @author División de Gestion de Entidades
 * @version 1.0
 */
class MunicionesService extends ZendExt_Model
{
    /**
     * Modelo de Partidas.
     * @var MunicionesModel
     */
    private $municiones;

    /**
     * Constructor de la clase.
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->municiones = new MunicionesModel();
    }
    
    /**
     * Devuelve las partidas del producto.
     * @param array $filtro
     * @param boolean $dql [Opcional]
     * @return array|Doctrine_Query
     */
    public function cargarMuniciones($filtro, $dql = false)
    {
        return $this->municiones->cargarMuniciones($filtro, $dql);
    }
    
    /**
     * Adiciona las partidas entrantes.
     * @param array $datos
     * @param numeric $indice
     * @param boolean $actualizar [Opcional] Determina si actualiza el movimiento.
     * @return array
     */
    public function adicionarPartida($datos, $indice, $actualizar = true)
    {
        return $this->municiones->adicionarPartida($datos, $indice, $actualizar);
    }
    
    /**
     * Elimina las partidas de un documento o movimientos de entrada eliminadas.
     * @param numeric $iddocumento
     * @param array $idmovimientos
     * @return boolean
     */
    public function eliminarPartidasCanceladas($iddocumento, $idmovimientos)
    {
        return $this->municiones->eliminarPartidasCanceladas($iddocumento, $idmovimientos);
    }

    /**
     * Actualiza la existencia de las partidas del documento.
     * @param numeric $iddocumento
     * @param boolean $cancelar [Opcional]
     * @return boolean
     */
    public function aprobarPartida($iddocumento, $cancelar = false)
    {
        return $this->municiones->aprobarPartida($iddocumento, $cancelar);
    }

    /**
     * Actualiza la existencia de las partidas de origen y destino de la transferencia entre areas.
     * @param numeric $iddocumento
     * @return boolean
     */
    public function aprobarPartidaTransferencia($iddocumento)
    {
        return $this->municiones->aprobarPartidaTransferencia($iddocumento);
    }

    public function getJsNomencladores()
    {        
        return '<script type="text/javascript" src="/logistica/inventario/armamento/views/js/nomencladores/revestimiento.component.js"></script>'
        . '<script type="text/javascript" src="/logistica/inventario/armamento/views/js/nomencladores/partida.component.js"></script>'
        . '<script type="text/javascript" src="/logistica/inventario/armamento/views/js/nomencladores/fabrica.component.js"></script>'
        . '<script type="text/javascript" src="/logistica/inventario/armamento/views/js/nomencladores/elemento.component.js"></script>'
        . ' <script type="text/javascript" src="/logistica/inventario/armamento/views/js/nomencladores/marcaarmamento.component.js"></script>'
        . ' <script type="text/javascript" src="/logistica/inventario/armamento/views/js/nomencladores/tecladoruso.component.js"></script>'
        . '<script type="text/javascript" src="/logistica/inventario/armamento/views/js/nomencladores/annofabricacion.component.js"></script>'
        . '<script type="text/javascript" src="/logistica/inventario/armamento/views/js/nomencladores/conservacion.component.js"></script>';
    }

}
