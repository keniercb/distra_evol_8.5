<?php

class TempAprobacionModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(TempAprobacion $tempAprobacion)
    {
        $tempAprobacion->save();
    }

    public function Actualizar(TempAprobacion $tempAprobacion)
    {
        $tempAprobacion->save();
    }

    public function Eliminar($tempAprobacion)
    {
        $tempAprobacion->delete();
    }
}

