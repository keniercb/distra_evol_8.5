<?php

class DatPlanificacionnaegeneralModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardatPlanificacionnaegeneral($datPlanificacionnaegeneral
    )
    {
        $datPlanificacionnaegeneral->save();
        return $datPlanificacionnaegeneral->idplanificacionnaegeneral;
    }

    public function modificardatPlanificacionnae($datPlanificacionnaegeneral
    )
    {
        $datPlanificacionnaegeneral->save();
    }

    public function eliminardatPlanificacionnaegeneral($datPlanificacionnaegeneral
    )
    {
        $datPlanificacionnaegeneral->delete();
    }

}


