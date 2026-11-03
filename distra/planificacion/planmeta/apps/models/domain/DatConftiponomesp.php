<?php

class DatConftiponomesp extends BaseDatConftiponomesp {

    public function setUp() {
        parent::setUp();
    }

    //Utilizado como servicio
    public function listarTiposNomencladoresXEsp($idespecialidad) {
        $q = new Doctrine_Query();
        $res = $q->from("NomTiponomenclador ntn")
                        ->innerJoin("ntn.NomDatosnomenclador ndn")
                        ->leftjoin("ntn.DatConftiponomesp dc")
                        ->where("dc.idespecialidad = ?", $idespecialidad)
                        ->orderby("ntn.idtiponomenclador")->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $res;
    }

    public function getAsoc($idespecialidad, $idtiponomenclador) {
        $query = new Doctrine_Query();
        $result = $query->from("DatConftiponomesp c")
                        ->where(
                                "c.idespecialidad = " . $idespecialidad
                                . " AND c.idtiponomenclador = " . $idtiponomenclador
                        )->execute();
        return $result;
    }

    public function getAsocparaListNivel($idespecialidad, $idtiponomenclador) {
        $query = new Doctrine_Query();
        $result = $query->from("DatConftiponomesp c")
                        ->where(
                                "c.idespecialidad = " . $idespecialidad
                                . " AND c.idtiponomenclador = " . $idtiponomenclador
                        )->execute()->toArray();
        return $result;
    }

}
