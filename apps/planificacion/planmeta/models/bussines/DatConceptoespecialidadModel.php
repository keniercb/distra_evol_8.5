<?php

class DatConceptoespecialidadModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardatConceptoespecialidad(DatConceptoespecialidad $datConceptoespecialidad
    )
    {
        $datConceptoespecialidad->save();
        return $datConceptoespecialidad->idconceptoespecialidad;
    }

    public function modificardatConceptoespecialidad($datConceptoespecialidad)
    {
        $datConceptoespecialidad->save();
    }

    public function eliminardatConceptoespecialidad($datConceptoespecialidad)
    {
        $datConceptoespecialidad->delete();
    }
}


