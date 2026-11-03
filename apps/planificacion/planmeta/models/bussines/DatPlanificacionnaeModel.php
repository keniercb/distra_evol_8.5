<?php

class DatPlanificacionnaeModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardatPlanificacionnae($datPlanificacionnae)
    {
        $datPlanificacionnae->save();
        return $datPlanificacionnae->idplanificacionnae;
    }

    public function modificardatPlanificacionnae($datPlanificacionnae)
    {
        $datPlanificacionnae->save();
    }

    public function eliminardat_planificacionnae($datPlanificacionnae)
    {
        $datPlanificacionnae->delete();
    }

}


