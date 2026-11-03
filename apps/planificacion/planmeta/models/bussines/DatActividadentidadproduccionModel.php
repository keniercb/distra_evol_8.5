<?php

class DatActividadentidadproduccionModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardatActividadentidadproduccion($datActividadentidadproduccion
    )
    {
        $datActividadentidadproduccion->save();
    }

    public function modificardatActividadentidadproduccion($datActividadentidadproduccion
    )
    {
        $datActividadentidadproduccion->save();
    }

    public function eliminardatActividadentidadproduccion($datActividadentidadproduccion
    )
    {
        $datActividadentidadproduccion->delete();
    }
}


