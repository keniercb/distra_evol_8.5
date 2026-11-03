<?php

class DatAjusteexistenciaodModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardatAjusteexistenciaod($datAjusteexistenciaod)
    {
        $datAjusteexistenciaod->save();
    }

    public function modificardatAjusteexistenciaod($datAjusteexistenciaod)
    {
        $datAjusteexistenciaod->save();
    }

    public function eliminardatAjusteexistenciaod($datAjusteexistenciaod)
    {
        $datAjusteexistenciaod->delete();
    }
}


