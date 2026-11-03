<?php

class DatTransicionConfUsuarioModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(DatTransicionConfUsuario $datTransicionConfUsuario)
    {
        $datTransicionConfUsuario->save();
    }

    public function Actualizar(
        DatTransicionConfUsuario $datTransicionConfUsuario
    ) 
    {
        $datTransicionConfUsuario->save();
    }

    public function Eliminar($datTransicionConfUsuario)
    {
        $datTransicionConfUsuario->delete();
    }
}

