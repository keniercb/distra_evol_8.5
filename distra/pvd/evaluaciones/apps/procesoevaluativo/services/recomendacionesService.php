<?php
class recomendacionesService extends ZendExt_Model {
	
	public function getRecomendacionesPE($iddefprocesoevaluativo, $limit, $start){
		$aux = DatEvalprocesorecomendaciones::getRecomendacionesPE($iddefprocesoevaluativo, $limit, $start);
		return ZendExt_ClassStandard::ArrayObject($aux);
	}
	
	public function getCantRecomendacionesPE($iddefprocesoevaluativo){
		$aux = DatEvalprocesorecomendaciones::getCantRecomendacionesPE($iddefprocesoevaluativo);
		return $aux;
	}
	
	public function getPersonaRecomendacion($idpersonaevaluacion, $limit, $start){
		$aux = DatEvalpersonarecomendaciones::getPersonaRecomendacion($idpersonaevaluacion, $limit, $start);
		return ZendExt_ClassStandard::ArrayObject($aux);
	}
	
	public function getCantPersonaRecomendacion($idpersonaevaluacion){
		$aux = DatEvalpersonarecomendaciones::getCantPersonaRecomendacion($idpersonaevaluacion);
		return $aux;
	}
	
	public function adicionarPersonaRecomendacion($idrecomendacion, $idpersonaevaluacion){
		$objModel = new DatEvalpersonarecomendacionesModel();
		$aux = $objModel->Adicionar($idrecomendacion, $idpersonaevaluacion);
		return $aux;
	}

	public function eliminarPersonaRecomendacion($idpersonarecomendaciones){
		$aux = DatEvalpersonarecomendacionesModel::Eliminar($idpersonarecomendaciones);
		return $aux;
	}
	
	public function existePersonaRecomendacion($idrecomendacion, $idpersonaevaluacion){
		$aux = DatEvalpersonarecomendaciones::existePersonaRecomendacion($idrecomendacion, $idpersonaevaluacion);
		if($aux)
			return true;
		return false;
	}
	
	
}

?>