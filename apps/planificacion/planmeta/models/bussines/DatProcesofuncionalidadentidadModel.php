<?php

class DatProcesofuncionalidadentidadModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardatProcesofuncionalidadentidad($datProcesofuncionalidadentidad
    )
    {
        $datProcesofuncionalidadentidad->save();
    }

    public function modificardatProcesofuncionalidadentidad($datProcesofuncionalidadentidad
    )
    {
        $datProcesofuncionalidadentidad->save();
    }

    public function eliminardatProcesofuncionalidadentidad($datProcesofuncionalidadentidad
    )
    {
        $datProcesofuncionalidadentidad->delete();
    }
}


