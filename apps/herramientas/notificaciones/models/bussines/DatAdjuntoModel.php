<?php

class DatAdjuntoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardat_adjunto($datAdjunto)
    {
        $datAdjunto->save();
    }

    public function modificardat_adjunto($datAdjunto)
    {
        $datAdjunto->save();
    }

    public function eliminardat_adjunto($datAdjunto)
    {
        $datAdjunto->delete();
    }
}