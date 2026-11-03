<?php
class senyalamientosService extends ZendExt_Model {
	
	public function getSenalamientosPE($iddefprocesoevaluativo, $limit=15, $start=0){
		$aux = DatEvalprocesoresenyalamiento::getSenalamientosPE($iddefprocesoevaluativo, $limit, $start);
		return ZendExt_ClassStandard::ArrayObject($aux);
	}
	
	public function getCantSenalamientosPE($iddefprocesoevaluativo){
		$aux = DatEvalprocesoresenyalamiento::getCantSenalamientosPE($iddefprocesoevaluativo);
		return $aux;
	}
	
	public function getPersonaSenalamiento($idpersonaevaluacion, $limit, $start){
		$aux = DatEvalpersonasenyalamientos::getPersonaSenalamiento($idpersonaevaluacion, $limit, $start);
		return ZendExt_ClassStandard::ArrayObject($aux);
	}
	
	public function getCantPersonaSenalamiento($idpersonaevaluacion){
		$aux = DatEvalpersonasenyalamientos::getCantPersonaSenalamiento($idpersonaevaluacion);
		return $aux;
	}
	
	public function adicionarPersonaSenalamiento($idsenyalamiento, $idpersonaevaluacion){
		$objModel = new DatEvalpersonasenyalamientosModel();
		$aux = $objModel->Adicionar($idsenyalamiento, $idpersonaevaluacion);
		return $aux;
	}
	
	
	public function eliminarPersonaSenalamiento($idpersonasenyalamientos){
		$aux = DatEvalpersonasenyalamientosModel::Eliminar($idpersonasenyalamientos);
		return $aux;
	}
	
	public function existePersonaSenalamiento($idsenyalamiento, $idpersonaevaluacion){
		$aux = DatEvalpersonasenyalamientos::existePersonaSenalamiento($idsenyalamiento, $idpersonaevaluacion);
		if($aux)
			return true;
		return false;
	}
	
	
}

?>