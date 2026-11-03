<?php
class definirprocesoService extends ZendExt_Model {		

	public function BuscarPlanilla($idplanilla){
		$result = DatEvaldefprocesoevaluativo::SearchPlanilla($idplanilla);
		return ZendExt_ClassStandard::ArrayObject ($result);
	}	
	
	public function ObtenerTodosIdPlanillas(){
		$result = DatEvaldefprocesoevaluativo::ObtenerTodosIdPlanillas();
		return ZendExt_ClassStandard::ArrayObject ($result);
	}
	
	public function obtenerPlanillaByIdProceso($iddefprocesoevaluativo){
		$result = DatEvaldefprocesoevaluativo::obtenerPlanillaByIdProceso($iddefprocesoevaluativo);
		return ZendExt_ClassStandard::ArrayObject ($result);
	}

	public function TipoProcesoEnUso($idtipoprocesoevaluativo){
		$result = DatEvaldefprocesoevaluativo::TipoProcesoEnUso($idtipoprocesoevaluativo);
		return $result;
	}
	
}

?>