<?php

class DatTransicionModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(DatTransicion $datTransicion)
    {
        $datTransicion->save();
        return true;
    }

    public function Actualizar(DatTransicion $datTransicion)
    {
        $datTransicion->save();
    }

    public function Eliminar($datTransicion)
    {
        $datTransicion->delete();
    }
}

