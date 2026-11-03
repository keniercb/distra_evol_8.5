<?php

class DatJabberContentModel extends DatContenidoModel
{
    public function DatJabberContentModel()
    {
        parent::DatContenidoModel();
    }

    public function insertardat_jabber_content(
        DatJabberContent $datJabberContent
    )
    {
        $id = parent:: insertardat_contenido();
        $datJabberContent->idcontenido = $id;
        $datJabberContent->save();

        return $id;
    }

    public function modificardat_jabber_content(
        DatJabberContent $datJabberContent
    )
    {
        $datJabberContent->save();
    }

    public function eliminardat_jabber_content(
        DatJabberContent $datJabberContent
    )
    {
        $datJabberContent->delete();
    }
} 