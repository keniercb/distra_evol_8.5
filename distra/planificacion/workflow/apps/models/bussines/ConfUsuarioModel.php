<?php

class ConfUsuarioModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(ConfUsuario $confUsuario)
    {
        $confUsuario->save();
    }

    public function Actualizar(ConfUsuario $confUsuario)
    {
        $confUsuario->save();
    }

    public function Eliminar($confUsuario)
    {
        $confUsuario->delete();
    }
}

