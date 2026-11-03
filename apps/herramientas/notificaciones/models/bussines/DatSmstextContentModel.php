<?php

class DatSmstextContentModel extends DatContenidoModel
{
    public function setUp()
    {
        parent::DatContenidoModel();
    }

    public function insertardat_smstext_content(
        DatSmstextContent $datSmsContent
    )
    {
        $id = parent:: insertardat_contenido();
        $datSmsContent->idcontenido = $id;
        $datSmsContent->save();

        return $id;
    }

    public function modificardat_smstext_content(
        DatSmstextContent $datSmsContent
    )
    {
        $datSmsContent->save();
    }

    public function eliminardat_smstext_content(
        DatSmstextContent $datSmsContent
    )
    {
        $datSmsContent->delete();
    }
}