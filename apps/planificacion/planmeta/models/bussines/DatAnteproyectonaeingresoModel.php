<?php

class DatAnteproyectonaeingresoModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardatAnteproyectonaeingreso(DatAnteproyectonaeingreso $datAnteproyectonaeingreso
    )
    {
        $datAnteproyectonaeingreso->save();
        return $datAnteproyectonaeingreso->idanteproyectonaeingreso;
    }

    public function modificardatAnteproyectonaeingreso($datAnteproyectonaeingreso
    )
    {
        $datAnteproyectonaeingreso->save();
    }

    public function eliminardatAnteproyectonaeingreso($datAnteproyectonaeingreso
    )
    {
        $datAnteproyectonaeingreso->delete();
    }

}


