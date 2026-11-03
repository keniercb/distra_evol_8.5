<?php

class DatActividadentidadmanualModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(DatActividadentidadmanual $DatActividadentidadmanual
    )
    {
        $DatActividadentidadmanual->save();
    }

    public function Actualizar(DatActividadentidadmanual $DatActividadentidadmanual
    )
    {
        $DatActividadentidadmanual->save();
    }

    public function Eliminar($DatActividadentidadmanual)
    {
        $DatActividadentidadmanual->delete();
    }
}

//fin clase
