<?php

class NomTipoDestinatarioModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertarnom_tipo_destinatario($nomTipoDestinatario)
    {
        $nomTipoDestinatario->save();
    }

    public function modificarnom_tipo_destinatario($nomTipoDestinatario)
    {
        $nomTipoDestinatario->save();
    }

    public function eliminarnom_tipo_destinatario($nomTipoDestinatario)
    {
        $nomTipoDestinatario->delete();
    }
}