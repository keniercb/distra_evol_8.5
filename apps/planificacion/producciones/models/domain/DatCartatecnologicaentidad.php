<?php

class DatCartatecnologicaentidad extends BaseDatCartatecnologicaentidad {

    public function setUp() {
        parent::setUp();
        $this->hasOne(
                'DatCartatecnologica', array('local' => 'idcartatecnologica', 'foreign' => 'idcartatecnologica')
        );
    }

    public function desasociarEntidadCartaTecnologica($idcartatecno, $identidad) {
        $conn = Doctrine_Manager::connection();
        $sql = "DELETE FROM mod_spouam.dat_cartatecnologicaentidad varcarttecno
                WHERE varcarttecno.idcartatecnologica = {$idcartatecno}
                AND varcarttecno.identidad = {$identidad}";
        $conn->execute($sql);
    }

    public function adicionarCartaTecnoEntidad($idcartatecno, $identidad) {
        $conn = Doctrine_Manager::connection();
        $sql = "INSERT INTO mod_spouam.dat_cartatecnologicaentidad(idcartatecnologica,identidad)
                VALUES ({$idcartatecno},{$identidad});";
        $conn->execute($sql);
    }

    public function eliminarRelacionCartaTecnoEntidad($idcarta, $identidad) {
        $conn = Doctrine_Manager::connection();
        $sql = "DELETE FROM 
                    mod_spouam.dat_cartatecnologicaentidad 
                  WHERE 
                    idcartatecnologica = $idcarta
                    and identidad<>$identidad";
        $conn->execute($sql);
    }

}
