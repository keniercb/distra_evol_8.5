<?php

class NomTipomaterialModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertarnom_tipomaterial($nomTipomaterial)
    {
        $nomTipomaterial->save();
    }

    public function modificarnom_tipomaterial($nomTipomaterial)
    {
        $nomTipomaterial->save();
    }

    public function eliminarnom_tipomaterial($nomTipomaterial)
    {
        $nomTipomaterial->delete();
    }
}


