<?php

class DatBahia extends BaseDatBahia {

    public function setUp() {
        parent :: setUp();
    }

    public function getByid($idmedio) {
        return Doctrine::getTable('DatBahia')->find($idmedio)->toArray();
    }

    public function cargarBahias() {
        $conn = Doctrine_Manager::connection();
        $sql = "select glob.idnomenclador,acc.idbahia
                        FROM mod_planifinversiones.dat_medioambglobal glob
                        INNER JOIN mod_planifinversiones.dat_bahia acc ON (glob.idmedioambglobal =  acc.idbahia)";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

}

