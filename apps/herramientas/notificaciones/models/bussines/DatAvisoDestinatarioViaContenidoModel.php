<?php

class DatAvisoDestinatarioViaContenidoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardat_aviso_destinatario_via_contenido(
        DatAvisoDestinatarioViaContenido $datAvisoDestinatarioViaContenido
    )
    {
        $datAvisoDestinatarioViaContenido->save();
    }

    public function modificardat_aviso_destinatario_via_contenido(
        DatAvisoDestinatarioViaContenido $datAvisoDestinatarioViaContenido
    )
    {
        $datAvisoDestinatarioViaContenido->save();
    }

    public function eliminardat_aviso_destinatario_via_contenido(
        DatAvisoDestinatarioViaContenido $datAvisoDestinatarioViaContenido
    )
    {
        $datAvisoDestinatarioViaContenido->delete();
    }

    public static function getContentsByAviso($idaviso)
    {
        return DatAvisoDestinatarioViaContenido:: getContentsByAviso(
            $idaviso, false
        );
    }
}