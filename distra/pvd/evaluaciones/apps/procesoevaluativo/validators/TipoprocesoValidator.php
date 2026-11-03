<?php
	class TipoprocesoValidator
	{	
	public $post;
	public $tipoproceso;
	
	
		public function TipoprocesoValidator()
		{
			$this->post 	= $_POST;
			$this->tipoproceso 	= new NomEvaltipoprocesoevaluativoModel();
			
		}
		
		public function existeTipoProceso(){
			$result = $this->tipoproceso->existeDenominacion($this->post['denom']);
			if($result)
				return false;
			return true;
		}
		
		public function TipoProcesoEnUso()
		{
		  $uso = $this->tipoproceso->TipoProcesoEnUso($this->post['idtipoprocesoevaluativo']);
		  if($uso)
		     return false;
			 return true;
		}
	}
?>