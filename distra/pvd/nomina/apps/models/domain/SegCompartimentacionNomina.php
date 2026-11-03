<?php

class SegCompartimentacionNomina extends BaseSegCompartimentacionNomina {

	
    public function setUp(){
        parent::setUp();
    }
    
    public function verificarCompartimentacionCargo($idcargo, $idtiponomina, $idnomina){
		$sql = "select scn.idcompartimentacionnomina, scn.idcargo, scnc.permiso, nac.operacionpermiso
		from mod_nomina.seg_compartimentacionnomina scn
		left join mod_nomina.seg_compartimentacioncargoportiponomina scnc on (scnc.idcompartimentacionnomina = scn.idcompartimentacionnomina)
		left join mod_nomina.dat_nominaaprobacioncertificacion nac on (nac.idcompartimentacionnomina = scn.idcompartimentacionnomina and nac.idnomina = ?)
		where scn.idcargo = ? and scnc.idtiponomina = ? ";
		$mg = Doctrine_Manager::getInstance();
		$conn = $mg->getCurrentConnection();
		return $conn->fetchAll($sql, array($idnomina, $idcargo, $idtiponomina));
	}
	
	public function ListarCargosCompartimentacion(){
		$sql = "select * from mod_nomina.seg_compartimentacionnomina ;";
		$mg = Doctrine_Manager::getInstance();
		$conn = $mg->getCurrentConnection();
		return $conn->fetchAll($sql);
	}
	
	public function ObtenerCompartimentacion($idcompartimentacionnomina){
		$sql = "select scn.*, ntn.denominacion as tiponomina from mod_nomina.seg_compartimentacionnomina sc
					inner join mod_nomina.seg_compartimentacioncargoportiponomina scn on (scn.idcompartimentacionnomina = sc.idcompartimentacionnomina) 
					left join mod_nomina.nom_tiponomina ntn on (ntn.idtiponomina = scn.idtiponomina)
					where sc.idcompartimentacionnomina = ? ;";
					
		$mg = Doctrine_Manager::getInstance();
		$conn = $mg->getCurrentConnection();
		return $conn->fetchAll($sql, array($idcompartimentacionnomina));
	}
    
}
