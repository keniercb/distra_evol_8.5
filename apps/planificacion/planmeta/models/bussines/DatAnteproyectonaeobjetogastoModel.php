<?php

class DatAnteproyectonaeobjetogastoModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardatAnteproyectonaeobjetogasto(
        DatAnteproyectonaeobjetogasto $datAnteproyectonaeobjetogasto
    )
    {
        $datAnteproyectonaeobjetogasto->save();
        return $datAnteproyectonaeobjetogasto->idanteproyectonaeobjetogasto;
    }

    public function modificardatAnteproyectonaeobjetogasto($datAnteproyectonaeobjetogasto
    )
    {
        $datAnteproyectonaeobjetogasto->save();
    }

    public function eliminardatAnteproyectonaeobjetogasto($datAnteproyectonaeobjetogasto
    )
    {
        $datAnteproyectonaeobjetogasto->delete();
    }

}


