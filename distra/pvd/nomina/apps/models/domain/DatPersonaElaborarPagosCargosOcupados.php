<?php

class DatPersonaElaborarPagosCargosOcupados extends BaseDatPersonaElaborarPagosCargosOcupados {

    public function setUp(){
        parent::setUp();
        $this->hasMany('DatPersonaElaborarPagos', array(
             'local' => 'idpersonaelaborarpagos',
             'foreign' => 'idpersonaelaborarpagos',
             'refClass' => 'DatPersonaElaborarPagosCargosOcupados'
        ));
        
        $this->hasMany('DatCargosOcupados', array(
             'local' => 'idcargosocupados',
             'foreign' => 'idcargosocupados',
             'refClass' => 'DatPersonaElaborarPagosCargosOcupados'
        ));
       
    }
    
    public static function obtenerCargosOcupadosPersonaElaborarPago( $idpersonaelaborarpagos) {
                $sql = "select dpeoco.*
							from mod_nomina.dat_personaelaborarpagoscargosocupados	dpeoco
							where dpeoco.idpersonaelaborarpagos = ? ;";
				$mg = Doctrine_Manager::getInstance();
				$conn = $mg->getCurrentConnection();
				$r = $conn->fetchAll($sql, array($idpersonaelaborarpagos));
               return $r;
    }
    
    
}
