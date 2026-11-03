<?php

class DatPlanificacionnaeingresoModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardatPlanificacionnaeingreso($datPlanificacionnaeingreso
    )
    {
        $datPlanificacionnaeingreso->save();
        $idingreso = $datPlanificacionnaeingreso->idingreso;
        return $idingreso;
    }

    public function modificardatPlanificacionnaeingreso($datPlanificacionnaeingreso
    )
    {
        $datPlanificacionnaeingreso->save();
    }

    public function eliminardatPlanificacionnaeingreso($datPlanificacionnaeingreso
    )
    {
        $datPlanificacionnaeingreso->delete();
    }

}


