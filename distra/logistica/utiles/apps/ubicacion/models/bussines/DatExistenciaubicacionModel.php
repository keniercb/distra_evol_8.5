<?php

class DatExistenciaubicacionModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function addDqlCantidadEnExistenciaUbicacion(Doctrine_Query $query, $aliasExternoProd, $aliasLocal = 'mv')
    {
        return $query->addSelect(
            "(SELECT SUM({$aliasLocal}.cantidad)
                          FROM DatExistenciaubicacion $aliasLocal,
                             {$aliasLocal}.DatUbicacionproducto dmv
                          Where dmv.idproducto = {$aliasExternoProd}.idproducto) AND 
                                {$aliaslocal}.cantidad IS NOT NULL as cantidad"
        );
    }

    public function existeProductoUbicacion($idproducto, $idestructuraubicacion)
    {
        $objeto = new DatExistenciaubicacion();
        $existencia = $objeto->existeProductoUbicacion($idproducto, $idestructuraubicacion);
        return $existencia;
    }

    public function actualizarUbicacion($idexistenciaubicacion, $cantidad)
    {
        $existencia = Doctrine::getTable('DatExistenciaubicacion')->find($idexistenciaubicacion);
        $valor = $existencia->cantidad;
        $existencia->cantidad = $valor + $cantidad;
        $existencia->save();
    }

    public function cargarUbicacionesExistencia($idproducto)
    {
        $objeto = new DatExistenciaubicacion();
        return $objeto->cargarUbicacionesExistencia($idproducto);
    }

    public function adicionaUbicacion($idestructuraubicacion, $cantidad, $idproducto, $idestructuracomun)
    {
        $rama = new DatRamaProducto();
        $rama->idestructuracomun = $idestructuracomun;
        $idprod = self::getProducto($idproducto);
        $rama->idprod = $idprod[0]['idindicador'];
        $fecha = date("Y-m-d");
        $rama->fecha = $fecha;
        $rama->save();
        $idrama = $rama->idramaproducto;
        $existencia = new DatExistenciaubicacion();
        $existencia->idestructuraubicacion = $idestructuraubicacion;
        $existencia->cantidad = $cantidad;
        $existencia->idramaproducto = $idrama;
        $existencia->save();
        $idexistencia = $existencia->idexistenciaubicacion;
        $ubicacion = new DatUbicacionproducto();
        $ubicacion->idexistenciaubicacion = $idexistencia;
        $ubicacion->idproducto = $idproducto;
        $ubicacion->save();
    }

    public function getProducto($idproducto)
    {
        $objeto = new DatExistenciaubicacion();
        return $objeto->getProducto($idproducto);
    }

}

