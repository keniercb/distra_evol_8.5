<?php

class DatRotacionturnosModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /*
     * Obtener un listado de los datos
    */
    public function obtenerListadoRotacionTurnos($inicio = 0, $limite = 15, $idrotacion)
    {
        return DatRotacionturnos::obtenerListadoRotacionTurnos($inicio, $limite, $idrotacion);
    }


}

