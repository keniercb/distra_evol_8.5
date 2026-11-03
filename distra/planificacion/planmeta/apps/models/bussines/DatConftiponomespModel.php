<?php

class DatConftiponomespModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardatConftiponomesp($datConftiponomesp)
    {
        $datConftiponomesp->save();
    }

    public function modificardatConftiponomesp($datConftiponomesp)
    {
        $datConftiponomesp->save();
    }

    public function eliminardatConftiponomesp($datConftiponomesp)
    {
        $datConftiponomesp->delete();
    }
}


