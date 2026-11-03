<?php

/**
 * Created by PhpStorm.
 * User: Chinete
 * Date: 13/10/2016
 * Time: 13:35
 */
class PlanificacionintegracionModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getMatricesPlanificacion($idproyectoplanificacion, $iddatosnomenclador)
    {
        return DatPlanificacionmatriz::getMatricesPlanificacion($idproyectoplanificacion, $iddatosnomenclador);
    }

    public function saveMatricesPlanificacion($idproyectoplanificacion, $idproyecto, $campo, $iddatosnomenclador)
    {
        $matrices = DatPlanificacionmatriz::getMatricesPlanificacion($idproyectoplanificacion, $iddatosnomenclador);
        if ($matrices) {
            $obj = DatPlanificacionmatriz::getByid($matrices[0]['idproyectoplanificacion']);
            $obj->$campo = $idproyecto;
            $result = DatPlanificacionmatriz::saveMatricesPlanificacion($obj);
        } else {
            $obj = new DatPlanificacionmatriz();
            $obj->idproyectoplanificacion = $idproyectoplanificacion;
            $obj->iddatosnomenclador = $iddatosnomenclador;
            $obj->$campo = $idproyecto;
            $result = DatPlanificacionmatriz::saveMatricesPlanificacion($obj);
        }
        return $result;
    }
}