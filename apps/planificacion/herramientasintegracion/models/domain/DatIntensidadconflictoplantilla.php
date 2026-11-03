<?php

class DatIntensidadconflictoplantilla extends BaseDatIntensidadconflictoplantilla {

    public function setUp() {
        parent:: setUp();
    }

    public function getByid($idintensidadconflictoplantilla) {
        return Doctrine::getTable('DatIntensidadconflictoplantilla')->find($idintensidadconflictoplantilla)->toArray();
    }

    static function getPlantilla($idintensidadconflictoplantilla) {
        return Doctrine::getTable('DatIntensidadconflictoplantilla')->find($idintensidadconflictoplantilla)->toArray();
    }

    static function getIntensidadconflictoplantilla() {
        try {
            $q = Doctrine_Query::create();
            $q->from('DatIntensidadconflictoplantilla icp')->orderBy('icp.idintensidadconflictoplantilla asc')->setHydrationMode(Doctrine::HYDRATE_ARRAY);
            $res = $q->execute();
            return $res;
        } catch (Exception $exc) {
            print_r($exc->getMessage());
            die;
        }
    }

}
