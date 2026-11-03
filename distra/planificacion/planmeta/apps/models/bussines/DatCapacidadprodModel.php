<?php

class DatCapacidadprodModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardatCapacidadprod($datCapacidadprod)
    {
        $datCapacidadprod->save();
    }

    public function modificardatCapacidadprod($datCapacidadprod)
    {
        $datCapacidadprod->save();
    }

    public function eliminardatCapacidadprod($datCapacidadprod)
    {
        $datCapacidadprod->delete();
    }
}


