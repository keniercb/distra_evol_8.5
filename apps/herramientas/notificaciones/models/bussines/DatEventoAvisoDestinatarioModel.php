<?php

class DatEventoAvisoDestinatarioModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public static function insertardat_evento_aviso_destinatario(
        DatEventoAvisoDestinatario $datEventoAvisoDestinatario
    )
    {
        $datEventoAvisoDestinatario->save();
    }

    public static function modificardat_evento_aviso_destinatario(
        DatEventoAvisoDestinatario $datEventoAvisoDestinatario
    )
    {
        $datEventoAvisoDestinatario->save();

    }

    public static function eliminardat_evento_aviso_destinatario(
        DatEventoAvisoDestinatario $datEventoAvisoDestinatario
    )
    {
        $datEventoAvisoDestinatario->delete();
    }

}