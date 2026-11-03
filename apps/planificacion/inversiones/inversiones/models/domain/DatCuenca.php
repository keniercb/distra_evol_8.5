<?php

class DatCuenca extends BaseDatCuenca {

    public function setUp() {
        parent :: setUp();
    }

    public function getByid($idmedio) {
        return Doctrine::getTable('DatCuenca')->find($idmedio)->toArray();
    }

    public function cargarCuencas() {
        $conn = Doctrine_Manager::connection();
        $sql = "select glob.idnomenclador,acc.idaccion
                        FROM mod_planifinversiones.dat_medioambglobal glob
                        INNER JOIN mod_planifinversiones.dat_accion acc ON (glob.idmedioambglobal =  acc.idaccion)";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

}

