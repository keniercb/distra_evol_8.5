<?php


class ConfActividadCentroCosto extends BaseConfActividadCentroCosto
{
    public function setUp()
    {
        parent:: setUp();
    }

    public function existeActividad($idcartatecindustrial, $idcartatecindustrialactividad, $identidad)
    {
        $existe = LogisticaDoctrineHelper::__init()->query(
            "SELECT count(cac.idactcentrocosto) as cantidad "
            . "FROM ConfActividadCentroCosto cac WHERE cac.idcartatecindustrial = {$idcartatecindustrial} "
            . "AND idcartatecindustrialactividad = {$idcartatecindustrialactividad} AND cac.identidad = {$identidad}"
        )->toArray();
        return $existe[0]['cantidad'] == 0 ? false : true;
    }
}