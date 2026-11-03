<?php

class DatCondicionModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(DatCondicion $datCondicion)
    {
        if ($datCondicion->save()) {
            return true;
        }
    }

    public function Actualizar(DatCondicion $datCondicion)
    {
        $datCondicion->save();
    }

    public function Eliminar($datCondicion)
    {
        $datCondicion->delete();
    }
}

