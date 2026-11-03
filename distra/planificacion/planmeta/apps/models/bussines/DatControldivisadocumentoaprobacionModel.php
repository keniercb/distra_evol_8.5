<?php

class DatControldivisadocumentoaprobacionModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardatControldivisadocumentoaprobacion($datControldivisadocumentoaprobacion
    )
    {
        $datControldivisadocumentoaprobacion->save();
    }

    public function modificardatControldivisadocumentoaprobacion($datControldivisadocumentoaprobacion
    )
    {
        $datControldivisadocumentoaprobacion->save();
    }

    public function eliminardatControldivisadocumentoaprobacion($datControldivisadocumentoaprobacion
    )
    {
        $datControldivisadocumentoaprobacion->delete();
    }
}


