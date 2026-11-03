<?php

class DatPlanificacionmatriz extends BaseDatPlanificacionmatriz
{

    public function setUp()
    {
        parent:: setUp();
    }

    public function getByid($idplanificacionmatriz)
    {
        return Doctrine::getTable('DatPlanificacionmatriz')->find($idplanificacionmatriz);
    }

    public function getMatricesPlanificacion($idproyectoplanificacion, $iddatosnomenclador)
    {
        $q = Doctrine_Query::create();
        $q->select('m.*')
            ->from('DatPlanificacionmatriz m')
            ->where('m.idproyectoplanificacion = ?', $idproyectoplanificacion)
            ->andWhere('m.iddatosnomenclador = ?', $iddatosnomenclador)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        $result = $q->execute();
        return $result;
    }

    public function saveMatricesPlanificacion($obj)
    {
        try {
            $obj->save();
            return $obj->idproyectoplanificacion;
        } catch (Exception $exc) {
            print_r($exc->getMessage());
            die;
        }
    }


}

