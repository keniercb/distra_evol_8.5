<?php

class DatDocumentoaprobcontroldivisaindicadorModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardatDocumentoaprobcontroldivisaindicador($datDocumentoaprobcontroldivisaindicador
    )
    {
        $datDocumentoaprobcontroldivisaindicador->save();
    }

    public function modificardatDocumentoaprobcontroldivisaindicador($datDocumentoaprobcontroldivisaindicador
    )
    {
        $datDocumentoaprobcontroldivisaindicador->save();
    }

    public function eliminardatDocumentoaprobcontroldivisaindicador($datDocumentoaprobcontroldivisaindicador
    )
    {
        $datDocumentoaprobcontroldivisaindicador->delete();
    }
}


