<?php

class SegCompartimentacionCargoPorTipoNomina extends BaseSegCompartimentacionCargoPorTipoNomina {

	
    public function setUp(){
        parent::setUp();
    }
    
    public function obtenerCompartimentacionTiposNomina($idcompartimentacionnomina){
		$sql = "select * from mod_nomina.seg_compartimentacioncargoportiponomina where idcompartimentacionnomina = ?;";
		$mg = Doctrine_Manager::getInstance();
		$conn = $mg->getCurrentConnection();
		return $conn->fetchAll($sql, array($idcompartimentacionnomina));
	}
    
}
