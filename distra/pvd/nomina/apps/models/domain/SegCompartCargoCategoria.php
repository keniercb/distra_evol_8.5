<?php

class SegCompartCargoCategoria extends BaseSegCompartCargoCategoria {

	
    public function setUp(){
        parent::setUp();
    }
    
//    public function verificarCompartimentacionCargo($idcargo, $idtiponomina, $idnomina){
//		$sql = "select scn.idcompartimentacionnomina, scn.idcargo, scnc.permiso, nac.operacionpermiso
//		from mod_nomina.seg_compartimentacionnomina scn
//		left join mod_nomina.seg_compartimentacioncargoportiponomina scnc on (scnc.idcompartimentacionnomina = scn.idcompartimentacionnomina)
//		left join mod_nomina.dat_nominaaprobacioncertificacion nac on (nac.idcompartimentacionnomina = scn.idcompartimentacionnomina and nac.idnomina = ?)
//		where scn.idcargo = ? and scnc.idtiponomina = ? ";
//		$mg = Doctrine_Manager::getInstance();
//		$conn = $mg->getCurrentConnection();
//		return $conn->fetchAll($sql, array($idnomina, $idcargo, $idtiponomina));
//	}
//
//	public function ListarCargosCompartimentacion(){
//		$sql = "select * from mod_nomina.seg_compartimentacionnomina ;";
//		$mg = Doctrine_Manager::getInstance();
//		$conn = $mg->getCurrentConnection();
//		return $conn->fetchAll($sql);
//	}
//
	public function buscarcategorias($idcargo){
            $sql = "select scc.*,cp.denominacion
                          from mod_nomina.seg_compartcargocategoria scc
                          inner join mod_personaext.nom_categoriapersona cp on (cp.idcategoriapersona = scc.idcategoria)
                          where scc.idcargo =? ;";

    $mg = Doctrine_Manager::getInstance();
    $conn = $mg->getCurrentConnection();
    return $conn->fetchAll($sql, array($idcargo));
}

    public function existe($idcargo,$idcategoria){
            $sql = "select scc.*
                          from mod_nomina.seg_compartcargocategoria scc
                          where scc.idcargo = ? and scc.idcategoria = ?;";

    $mg = Doctrine_Manager::getInstance();
    $conn = $mg->getCurrentConnection();
    return $conn->fetchAll($sql, array($idcategoria,$idcargo));
}
    
}
