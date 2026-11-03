<?php

class seguridadevaluacionesValidator {
	
	public $post;
	
	function seguridadevaluacionesValidator() {
		$this->post = $_POST;
	}
	
	public function ExisteEvaluador() {
		$aux = new DatEvalseguridadevalentidadModel();
		$idestructura = $this->global->Estructura->idestructura;
		
		$existe = $aux->ExisteDatEvalseguridadevalentidad($this->post['idpersona'], $this->post['idPrepProcesoEvaluativo'], $idestructura);
		if ($existe)
			return false;
		return true;
	}
	
	public function ExisteEvaluado() {
		$aux = new DatEvalaccesoevalentidadModel();
		$existe = $aux->ExisteDatEvalaccesoevalentidad($this->post['idpersona'], $this->post['idevalseguridadevalentidad']);
		if ($existe)
			return false;
		return true;
	}
	
	
}
?>