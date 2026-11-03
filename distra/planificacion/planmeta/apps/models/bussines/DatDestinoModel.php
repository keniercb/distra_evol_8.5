<?php

class DatDestinoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(DatDestino $DatDestino)
    {
        $DatDestino->save();
    }

    public function Actualizar(DatDestino $DatDestino)
    {
        $DatDestino->save();
    }

    public function Eliminar($DatDestino)
    {
        $DatDestino->delete();
    }
}

//fin clase
