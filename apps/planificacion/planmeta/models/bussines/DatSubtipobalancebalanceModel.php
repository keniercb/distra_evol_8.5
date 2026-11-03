<?php

class DatSubtipobalancebalanceModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardatSubtipobalancebalance($datSubtipobalancebalance
    )
    {
        $datSubtipobalancebalance->save();
    }

    public function modificardatSubtipobalancebalance($datSubtipobalancebalance
    )
    {
        $datSubtipobalancebalance->save();
    }

    public function eliminardatSubtipobalancebalance($datSubtipobalancebalance
    )
    {
        $datSubtipobalancebalance->delete();
    }
}


