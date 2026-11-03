<?php

class DatPlansisplaninversionesModel extends DatPlanModel
{

    public function obtenerPlanesEntidadesPPN($parametros, $idejecicio)
    {
        $data = DatEntidadmodelosisplaninversiones::servBP_getModeloAsocEntidadesN($parametros, $idejecicio);

        return $data;
    }
}
