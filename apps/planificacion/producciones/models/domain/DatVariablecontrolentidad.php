<?php

class DatVariablecontrolentidad extends BaseDatVariablecontrolentidad {

    public function setUp() {
        parent::setUp();
        $this->hasOne(
                'DatVariablecontrol', array('local' => 'idvariablecontrol', 'foreign' => 'idvariablecontrol')
        );
    }

    public function desasociarVar($idelemento, $identidad) {

        $conn = Doctrine_Manager::connection();

        $sqlQuery = "DELETE FROM 
                        mod_spouam.dat_variablecontrolentidad 
                    WHERE 
                        idvariablecontrol=$idelemento AND
                        identidad IN($identidad)";
        $conn->execute($sqlQuery);
    }
    
    

    public function relacionEntidadesVariableControl($idvariablecontrol, $entidades)
    {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                    identidad
                  FROM 
                    mod_spouam.dat_variablecontrolentidad 
                    where idvariablecontrol=$idvariablecontrol and identidad IN($entidades)";
        $resp = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        return $resp;
    }

}
