<?php
class plantillasService extends ZendExt_Model {
	
	public function GetPlanillasPorLimite($limite = 15,$inicio = 0) {
		$aux = DatEvalplanillasevaluativas::GetPlanillasActivasPag($limite, $inicio);
		return ZendExt_ClassStandard::ArrayObject ($aux);
	}

	public function GetPlanillasPorDominioEvaluativo($iddominioevaluativo, $limite = 15, $inicio = 0) {
		$aux = DatEvalplanillasevaluativas::getPlanillaPorDominioEvaluativo($iddominioevaluativo, $limite, $inicio);		
		return ZendExt_ClassStandard::ArrayObject ($aux);
	}
	
	public function GetPlanillasPorTexto($texto, $limite = 15,$inicio = 0) {
		$aux = DatEvalplanillasevaluativas::getPlanillaPorTexto($texto, $limite, $inicio);		
		return ZendExt_ClassStandard::ArrayObject ($aux);
	}
	
	public function GetPlanillasActivas() {		
		$aux = DatEvalplanillasevaluativas::GetPlanillasActivas();			
		return ZendExt_ClassStandard::ArrayObject ($aux);			
	}
	
	public function GetPlanillaPorId($idplanilla) {
		$aux = DatEvalplanillasevaluativas::Buscar($idplanilla);		
		return ZendExt_ClassStandard::ArrayObject ($aux);
	}
	
	public function getArbolIndicadores($idplanilla, $idnodopadre) {
		$obj = new DatEvalplanillasevaluativasModel();	
		return ZendExt_ClassStandard::ArrayObject($obj->getArbolIndicadores($idplanilla, $idnodopadre));
	}
}

?>
