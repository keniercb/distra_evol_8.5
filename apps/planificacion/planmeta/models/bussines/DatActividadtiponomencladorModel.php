<?php

class DatActividadtiponomencladorModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(DatActividadtiponomenclador $DatActividadtiponomenclador
    )
    {
        $DatActividadtiponomenclador->save();
    }

    public function Actualizar(DatActividadtiponomenclador $DatActividadtiponomenclador
    )
    {
        $DatActividadtiponomenclador->save();
    }

    public function Eliminar($DatActividadtiponomenclador)
    {
        $DatActividadtiponomenclador->delete();
    }
}

//fin clase
