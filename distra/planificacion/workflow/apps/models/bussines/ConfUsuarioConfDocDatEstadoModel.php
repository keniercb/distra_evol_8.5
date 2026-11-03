<?php

class ConfUsuarioConfDocDatEstadoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(
        ConfUsuarioConfDocDatEstado $confUsuarioConfDocDatEstado
    )
    {
        $confUsuarioConfDocDatEstado->save();
    }

    public function Actualizar(
        ConfUsuarioConfDocDatEstado $confUsuarioConfDocDatEstado
    )
    {
        $confUsuarioConfDocDatEstado->save();
    }

    public function Eliminar($confUsuarioConfDocDatEstado)
    {
        $confUsuarioConfDocDatEstado->delete();
    }
}

