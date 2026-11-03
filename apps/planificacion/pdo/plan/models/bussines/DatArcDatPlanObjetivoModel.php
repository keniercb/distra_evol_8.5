<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatArcDatPlanObjetivoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(DatArcDatPlanObjetivo $datArcDatPlanObjetivo)
    {
        $datArcDatPlanObjetivo->save();
    }

    public function Actualizar(DatArcDatPlanObjetivo $datArcDatPlanObjetivo)
    {
        $datArcDatPlanObjetivo->save();
    }

    public function Eliminar($datArcDatPlanObjetivo)
    {
        $datArcDatPlanObjetivo->delete();
    }
}

