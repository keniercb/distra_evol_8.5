<?php

class DatEventoAvisoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardat_evento_aviso($datEventoAviso)
    {
        $datEventoAviso->save();
    }

    public function modificardat_evento_aviso($datEventoAviso)
    {
        $datEventoAviso->save();
    }

    public function eliminardat_evento_aviso($datEventoAviso)
    {
        $datEventoAviso->delete();
    }
}