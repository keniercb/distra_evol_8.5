<?php

class DatPrioridadcentrobalanceModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardatPrioridadcentrobalance($datPrioridadcentrobalance
    )
    {
        $datPrioridadcentrobalance->save();
    }

    public function modificardatPrioridadcentrobalance($datPrioridadcentrobalance
    )
    {
        $datPrioridadcentrobalance->save();
    }

    public function eliminardatPrioridadcentrobalance($datPrioridadcentrobalance
    )
    {
        $datPrioridadcentrobalance->delete();
    }
}


