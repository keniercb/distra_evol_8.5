<?php
class PrepararprocesoValidator
{
	public $post;
	public $comision;

	function PrepararprocesoValidator(){
		$this->post = $_POST;
		$this->comision = new DatEvalcomisionevaluacionModel( );	
	}
	
	public function comisionEnUso() {
		$existe = $this->comision->comisionEnUso($this->post['idcomisionevaluacion']);
		if ($existe)
			return false;
		return true;
	}
}
?>