<?php

class DatControldivisaindicadorplandestinoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardatControldivisaindicadorplandestino($datControldivisaindicadorplandestino
    )
    {
        $datControldivisaindicadorplandestino->save();
    }

    public function modificardatControldivisaindicadorplandestino($datControldivisaindicadorplandestino
    )
    {
        $datControldivisaindicadorplandestino->save();
    }

    public function eliminardatControldivisaindicadorplandestino($datControldivisaindicadorplandestino
    )
    {
        $datControldivisaindicadorplandestino->delete();
    }
}


