<?php

class DatControldivisadocumentomodeloModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardatControldivisadocumentodestino($datControldivisadocumentodestino
    )
    {
        $datControldivisadocumentodestino->save();
    }

    public function modificardatControldivisadocumentodestino($datControldivisadocumentodestino
    )
    {
        $datControldivisadocumentodestino->save();
    }

    public function eliminardatControldivisadocumentodestino($datControldivisadocumentodestino
    )
    {
        $datControldivisadocumentodestino->delete();
    }
}


