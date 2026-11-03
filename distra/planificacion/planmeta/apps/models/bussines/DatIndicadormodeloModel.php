<?php

class DatIndicadormodeloModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardatIndicadormodelo($datIndicadormodelo)
    {
        $datIndicadormodelo->save();
    }

    public function modificardatIndicadormodelo($datIndicadormodelo)
    {
        $datIndicadormodelo->save();
    }

    public function eliminardatIndicadormodelo($datIndicadormodelo)
    {
        $datIndicadormodelo->delete();
    }
}


