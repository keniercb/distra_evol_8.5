<?php

class DatSubsistemaConfDocModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(DatSubsistemaConfDoc $datSubsistemaConfDoc)
    {
        $datSubsistemaConfDoc->save();
    }

    public function Actualizar(DatSubsistemaConfDoc $datSubsistemaConfDoc)
    {
        $datSubsistemaConfDoc->save();
    }

    public function Eliminar($datSubsistemaConfDoc)
    {
        $datSubsistemaConfDoc->delete();
    }
}

