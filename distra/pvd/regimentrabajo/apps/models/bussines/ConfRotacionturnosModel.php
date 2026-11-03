<?php

class ConfRotacionturnosModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /*
     * Obtener un listado de los datos
    */
    public function obtenerListadoRotacionTurnos($inicio = 0, $limite = 15, $denominacion, $fdesde, $fhasta)
    {
        return ConfRotacionturnos::obtenerListadoRotacionTurnos($inicio, $limite, $denominacion, $fdesde, $fhasta);
    }

    /*
    * Obtener la cantidad total
    */
    public function obtenerCantidadTotalRotacionTurnos()
    {
        return ConfRotacionturnos::obtenerCantidadTotalRotacionTurnos();
    }

    /**
     * Insertar
     */
    public function InsertarRotacionTurnos($denominacion, $descripcion, $fdesde, $fhasta)
    {
        $objRotacionTurnos = new ConfRotacionturnos();
        $objRotacionTurnos->denominacion = $denominacion;
        $objRotacionTurnos->descripcion = $descripcion;
        $objRotacionTurnos->fdesde = $fdesde;
        $objRotacionTurnos->fhasta = $fhasta;

        //Guardando los datos.
        $objRotacionTurnos->save();
    }

    /**
     * Modificar
     */
    public function ModificarRotacionTurnos($idrotacionturnos, $denominacion, $descripcion, $fdesde, $fhasta)
    {
        $objRotacionTurnos = Doctrine:: getTable('ConfRotacionturnos')->find($idrotacionturno);
        $objRotacionTurnos->denominacion = $denominacion;
        $objRotacionTurnos->descripcion = $descripcion;
        $objRotacionTurnos->fdesde = $fdesde;
        $objRotacionTurnos->fhasta = $fhasta;

        //Guardando los datos.
        $objRotacionTurnos->save();
    }

    /**
     * Eliminar
     */
    public function EliminarRotacionTurnos($idrotacionturno)
    {
        $obj = Doctrine:: getTable('ConfRotacionturnos')->find($idrotacionturno);
        try {
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }

    public function GetAll()
    {
        $turnos = new ConfRotacionturnos();
        return $turnos->GetTodos();
    }

    public function existeRotacionTurnos($denominacion)
    {
        return ConfRotacionturnos::existe($denominacion);
    }

    public function getRotacionTurnos()
    {
        return ConfRotacionturnos::getrotacionturnos();
    }


}

