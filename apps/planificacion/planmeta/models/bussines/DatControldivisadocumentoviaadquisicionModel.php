<?php

class DatControldivisadocumentoviaadquisicionModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardatControldivisadocumentoviaadquisicion($datControldivisadocumentoviaadquisicion
    )
    {
        $datControldivisadocumentoviaadquisicion->save();
    }

    public function modificardatControldivisadocumentoviaadquisicion($datControldivisadocumentoviaadquisicion
    )
    {
        $datControldivisadocumentoviaadquisicion->save();
    }

    public function eliminardatControldivisadocumentoviaadquisicion($datControldivisadocumentoviaadquisicion
    )
    {
        $datControldivisadocumentoviaadquisicion->delete();
    }
}


