<?php

class TempGestionaractividadModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertartempGestionaractividad($tempGestionaractividad)
    {
        $tempGestionaractividad->save();
    }

    public function modificartempGestionaractividad($tempGestionaractividad)
    {
        $tempGestionaractividad->save();
    }

    public function eliminartempGestionaractividad($tempGestionaractividad)
    {
        $tempGestionaractividad->delete();
    }
}


