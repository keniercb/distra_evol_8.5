<?php


class DatRectortiponomespModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardatRectortiponomesp($datRectortiponomesp)
    {
        $datRectortiponomesp->save();
    }

    public function modificardatRectortiponomesp($datRectortiponomesp)
    {
        $datRectortiponomesp->save();
    }

    public function eliminardatRectortiponomesp($datRectortiponomesp)
    {
        $datRectortiponomesp->delete();
    }
}


