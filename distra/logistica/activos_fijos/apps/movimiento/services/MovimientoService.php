<?php

/**
 *
 */
class MovimientoService extends ZendExt_Model
{

    private $_mDatMovActivoFijo;
    private $_mDatActivoFijo;
    protected $idsubsistema;

    /**
     *
     */
    public function __construct($idsubsistema = LogisticaGlobal::SUBSISTEMA_AFT)
    {        
        $this->idsubsistema = $idsubsistema;        
        $this->_mDatMovActivoFijo = new MovimientoActivoFijoModel($this->idsubsistema);
        $this->_mDatActivoFijo = new ProductoActivoFijoModel();
    }

    /**
     *
     */
    public function getQueryDatMovimientos($alias, $select)
    {
        return $this->_mDatMovActivoFijo->getQueryMovimiento($alias, $select);
    }

    /**
     *
     */
    public function crearMovimiento($datos, $objDoc)
    {
        return $this->_mDatMovActivoFijo->crearMovDeDoc($datos, $objDoc);
    }

    /**
     *
     */
    public function actualizarCantidadMedios($iddocumento, $concepto)
    {
        return $this->_mDatActivoFijo->actualizarCantidadMedios($iddocumento, $concepto);
    }

    /**
     *
     */
    public function modDisponibilidadMedios($idproducto, $cantidad, $concepto)
    {
        return $this->_mDatActivoFijo->modDisponibilidadMedios($idproducto, $cantidad, $concepto);
    }


    public function modCantidadMedios($idproducto, $cantidad, $concepto)
    {
        return $this->_mDatActivoFijo->modCantidadMedios($idproducto, $cantidad, $concepto);
    }


    public function modCantidadDisponiblieMedios($idproducto, $cantidad, $concepto)
    {
        return $this->_mDatActivoFijo->modCantidadDisponiblieMedios($idproducto, $cantidad, $concepto);
    }



    /**
     *
     */
    public function getMovsConCantReal($parametros)
    {
        return $this->_mDatMovActivoFijo->getMovsConCantReal($parametros);
    }

    /**
     *
     */
    public function getMovimientosDocRegNum($parametros, $relacionOperaciones)
    {
        return $this->_mDatMovActivoFijo->getMovimientosDocRegNum($parametros, $relacionOperaciones);
    }

    /**
     *
     */
    public function eliminarProductoDoc($idmovimiento)
    {
        $this->_mDatMovActivoFijo->eliminarProductoDoc($idmovimiento);
    }

    /**
     *
     */
    public function getCantMediosEnMovByIdDocumento($idDocumento)
    {
        return $this->_mDatMovActivoFijo->getCantMediosEnMovByIdDocumento($idDocumento);
    }

    /**
     *
     */
    public function getInnerJoinDatMovimiento($query, $asExterno, $as)
    {
        return $this->_mDatMovActivoFijo->getInnerJoinDatMovimiento($query, $asExterno, $as);
    }

    /**
     *
     */
    public function getJoinDatMovimiento($query, $asExterno, $as)
    {
        return $this->_mDatMovActivoFijo->getJoinDatMovimiento($query, $asExterno, $as);
    }

}
