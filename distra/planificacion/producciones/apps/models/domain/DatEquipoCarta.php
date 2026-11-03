<?php

class DatEquipoCarta extends BaseDatEquipoCarta {

    public function setUp() {
        parent::setUp();
        $this->HasMany(
                'DatCartatecnologica', array('local' => 'idcartatecnologica', 'foreign' => 'idcartatecnologica')
        );
    }
    
    public function Eliminar($idequipocarta){
        $conn = Doctrine_Manager::connection();
        $query = "DELETE FROM mod_spouam.dat_equipocarta
                    WHERE 
                    idequipocarta = $idequipocarta";
        $conn->execute($query);
    }

}
