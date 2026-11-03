<?php

class DatAnteproyectonaeModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardatAnteproyectonae(DatAnteproyectonae $datAnteproyectonae
    )
    {
        $datAnteproyectonae->save();
        return $datAnteproyectonae->idanteproyectonae;
    }

    public function modificardatAnteproyectonae($datAnteproyectonae)
    {
        $datAnteproyectonae->save();
    }

    public function eliminardatAnteproyectonae($datAnteproyectonae)
    {
        $datAnteproyectonae->delete();
    }

}


