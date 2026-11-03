<?php
class reglasValidator
{
	public $post;
	public $regla;

	function reglasValidator(){
		$this->post = $_POST;
		$this->regla = new DatEvalreglaModel( );	
	}
	
	public function existeRegla() {
		$existe = $this->regla->existeRegla($this->post['idplanilla'], $this->post['denom']);
		if ($existe)
			return false;
		return true;
	}
	
	public function reglaEnUso() {
		$existe = $this->regla->reglaEnUso($this->post['idregla']);
		if ($existe)
			return false;
		return true;
	}
	
	public function reglaEnUsoHecho() {
		$existe = $this->regla->reglaEnUsoHecho($this->post['idregla']);
		if ($existe)
			return false;
		return true;
	}
}
?>