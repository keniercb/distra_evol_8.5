<?php

class NomTipocomentarioModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(NomTipocomentario $NomTipocomentario)
    {
        $NomTipocomentario->save();
    }

    public function Actualizar(NomTipocomentario $NomTipocomentario)
    {
        $NomTipocomentario->save();
    }

    public function Eliminar($NomTipocomentario)
    {
        $NomTipocomentario->delete();
    }
}

