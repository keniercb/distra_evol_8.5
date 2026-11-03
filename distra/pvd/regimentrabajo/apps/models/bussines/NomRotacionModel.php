<?php

class NomRotacionModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /*
     * Obtener un listado de los datos
    */
    public function obtenerListadoRotacion($inicio = 0, $limite = 15, $denominacion, $fdesde, $fhasta)
    {
        return NomRotacion::obtenerListadoRotacion($inicio, $limite, $denominacion, $fdesde, $fhasta);
    }

    /*
    * Obtener la cantidad total
    */
    public function obtenerCantidadTotalRotacion()
    {
        return NomRotacion::obtenerCantidadTotalRotacion();
    }

    /**
     * Insertar
     */
    public function InsertarRotacion($denominacion, $descripcion, $fdesde, $fhasta, $arreglo)
    {
        $objRotacion = new NomRotacion();
        $objRotacion->denominacion = $denominacion;
        $objRotacion->descripcion = $descripcion;
        $objRotacion->fdesde = $fdesde;
        $objRotacion->fhasta = $fhasta;

        //Guardando los datos.
        $objRotacion->save();
        $idrotacion = $objRotacion->idrotacion;

        foreach ($arreglo as $value) {
            $obj = new DatRotacionturnos();
            $obj->idrotacion = $idrotacion;
            $obj->idturnotrabajo = $value->idturnotrabajo;
            $obj->cantdias = $value->cantdias;
            $obj->save();
        }
    }

    /**
     * Modificar
     */
    public function ModificarRotacion($idrotacion, $denominacion, $descripcion, $fdesde, $fhasta, $arreglo)
    {
        $objRotacion = Doctrine:: getTable('NomRotacion')->find($idrotacion);
        $objRotacion->denominacion = $denominacion;
        $objRotacion->descripcion = $descripcion;
        $objRotacion->fdesde = $fdesde;
        $objRotacion->fhasta = $fhasta;

        //Guardando los datos.
        $objRotacion->save();
        $idrotacion = $objRotacion->idrotacion;

        foreach ($arreglo as $value) {
            $obj = new DatRotacionturnos();
            $obj->idrotacion = $idrotacion;
            $obj->idturnotrabajo = $value->idturnotrabajo;
            $obj->cantdias = $value->cantdias;
            $obj->save();
        }
    }

    /**
     * Eliminar
     */
    public function EliminarRotacion($idrotacion)
    {
        $objRotacion = new DatRotacionturnos();
        $result = $objRotacion->EliminarListadoRotacionTurnos($idrotacion);
        $obj = NomRotacion::getByid($idrotacion);
        try {
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }


    public function existeRotacion($denominacion)
    {
        return NomRotacion::existe($denominacion);
    }


}

