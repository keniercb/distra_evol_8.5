<?php

class DatPlanificacionnaeobjetogastoModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardatPlanificacionnaeobjetogasto($datPlanificacionnaeobjetogasto
    )
    {
        $datPlanificacionnaeobjetogasto->save();
        return $datPlanificacionnaeobjetogasto->idobjetogasto;
    }

    public function modificardatPlanificacionnaeobjetogasto($datPlanificacionnaeobjetogasto
    )
    {
        $datPlanificacionnaeobjetogasto->save();
    }

    public function eliminardatPlanificacionnaeobjetogasto($datPlanificacionnaeobjetogasto
    )
    {
        $datPlanificacionnaeobjetogasto->delete();
    }

}


