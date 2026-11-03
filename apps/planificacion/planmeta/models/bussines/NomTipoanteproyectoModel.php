<?php

class NomTipoanteproyectoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertarnomTipoanteproyecto($nomTipoanteproyecto)
    {
        $nomTipoanteproyecto->save();
    }

    public function modificarnomTipoanteproyecto($nomTipoanteproyecto)
    {
        $nomTipoanteproyecto->save();
    }

    public function eliminarnomTipoanteproyecto($nomTipoanteproyecto)
    {
        $nomTipoanteproyecto->delete();
    }
}


