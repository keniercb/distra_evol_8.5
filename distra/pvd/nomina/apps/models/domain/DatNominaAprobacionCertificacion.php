<?php

class DatNominaAprobacionCertificacion extends BaseDatNominaAprobacionCertificacion {

	
    public function setUp(){
        parent::setUp();
    }
    
    public function obtenerDatosAprobacionCertificacionNomina($idnomina){
		$sql = "select * from mod_nomina.dat_nominaaprobacioncertificacion where idnomina = ?;";
		$mg = Doctrine_Manager::getInstance();
		$conn = $mg->getCurrentConnection();
		return $conn->fetchAll($sql, array($idnomina));
	}
    
}
