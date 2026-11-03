<?php

class DatEmailContentModel extends DatContenidoModel
{
    public function DatEmailContentModel()
    {
        parent::DatContenidoModel();
    }

    public function insertardat_email_content(DatEmailContent $datEmailContent)
    {
        $id = parent:: insertardat_contenido();
        $datEmailContent->idcontenido = $id;
        $datEmailContent->save();

        return $id;
    }

    public function modificardat_email_content($datEmailContent)
    {
        $datEmailContent->save();
    }

    public function eliminardat_email_content($datEmailContent)
    {
        $datEmailContent->delete();
    }
}