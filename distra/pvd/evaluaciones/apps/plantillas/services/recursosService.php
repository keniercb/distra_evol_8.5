<?php
class recursosService extends ZendExt_Model {
	
	public function GetDominioEvaluativo($iddominio, $idrecurso) {
		$aux = DatEvaldominioevaluativo::GetDominioEvaluativo($iddominio, $idrecurso);
		return $aux;
	}
	
	public function GetTodosRecursos() {
		$aux = DatEvalrecursoevaluativo::GetTodos();
		return $aux;
	}	
	
}

?>