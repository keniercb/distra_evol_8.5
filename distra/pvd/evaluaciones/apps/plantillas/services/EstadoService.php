<?php
class EstadoService extends ZendExt_Model {
	
	
	public function CargarEstados(){
		$result = NomEvalestado::GetTodos();
		return ZendExt_ClassStandard::ArrayObject ($result);
	}
	
	
}

?>