<?php

class NomEjercicioplanificacionModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(NomEjercicioplanificacion $NomEjercicioplanificacion
    )
    {
        $NomEjercicioplanificacion->save();
    }

    public function Actualizar(NomEjercicioplanificacion $NomEjercicioplanificacion
    )
    {
        $NomEjercicioplanificacion->save();
    }

    public function Eliminar($NomEjercicioplanificacion)
    {
        $NomEjercicioplanificacion->delete();
    }

    public function listarejercicios()
    {

        return NomEjercicioplanificacion::listar();
    }

    public function obtenerEjercicios()
    {
        $data->data = NomEjercicioplanificacion::listarEjercicioActualByUri(
        );
        $data->idejercicioactual
            = NomEjercicioplanificacion::obtenerDenEjercicioActual();
        return $data;
    }

}

//fin clase

