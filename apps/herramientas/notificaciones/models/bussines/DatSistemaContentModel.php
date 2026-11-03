<?php

class DatSistemaContentModel extends DatContenidoModel
{
    public function setUp()
    {
        parent::DatContenidoModel();
    }

    public function insertardat_sistema_content(
        DatSistemaContent $datSistemaContent
    )
    {
        $id = parent:: insertardat_contenido();
        $datSistemaContent->idcontenido = $id;
        $datSistemaContent->save();

        return $id;
    }

    public function modificardat_sistema_content(
        DatSistemaContent $datSistemaContent
    )
    {
        $datSistemaContent->save();
    }

    public function eliminardat_sistema_content(
        DatSistemaContent $datSistemaContent
    )
    {
        $datSistemaContent->delete();
    }
} 