<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatArcDatPlanModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(DatArcDatPlan $datArcDatPlan)
    {
        $datArcDatPlan->save();
    }

    public function Actualizar(DatArcDatPlan $datArcDatPlan)
    {
        $datArcDatPlan->save();
    }

    public function Eliminar($datArcDatPlan)
    {
        $datArcDatPlan->delete();
    }


}

