<?php

class DatAjusteexistenciacbModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardatAjusteexistenciacb($datAjusteexistenciacb)
    {
        $datAjusteexistenciacb->save();
    }

    public function modificardatAjusteexistenciacb($datAjusteexistenciacb)
    {
        $datAjusteexistenciacb->save();
    }

    public function eliminardatAjusteexistenciacb($datAjusteexistenciacb)
    {
        $datAjusteexistenciacb->delete();
    }
}


