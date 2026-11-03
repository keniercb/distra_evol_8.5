<?php
class recursosValidator
{
	public $post;
	public $recurso;
	
	public function recursosValidator()
	{
		$this->post = $_POST;
		$this->recurso = new DatEvalrecursoevaluativoModel( );
	}
	
	public function existeRecurso() 
	{
		$existe = $this->recurso->existeRecurso($this->post['denom']);		
		if ($existe)
			return false;
		return true;
	}
}
?>