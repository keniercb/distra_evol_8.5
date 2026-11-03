<?php

class DatGrupoDestinatarioModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardat_grupo_destinatario(
        DatGrupoDestinatario $datGrupoDestinatario
    )
    {
        if (!$datGrupoDestinatario->existe()) {
            $datGrupoDestinatario->save();

            return true;
        }

        return false;
    }

    public function modificardat_grupo_destinatario(
        DatGrupoDestinatario $datGrupoDestinatario
    )
    {
        $datGrupoDestinatario->save();
    }

    public function eliminardat_grupo_destinatario(
        DatGrupoDestinatario $datGrupoDestinatario
    )
    {
        $datGrupoDestinatario->delete();
    }

    public function eliminarPersonasFromGroup($grupo, $personas)
    {
        DatGrupoDestinatario:: deletePersonsFromGroup($grupo, $personas);
    }
} 