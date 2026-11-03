<?php
	class definirprocesoValidator
	{
		public $post;
		public $objDefProcesoModel;
		
		function definirprocesoValidator() {
			$this->post = $_POST;
			$this->objDefProcesoModel = new DatEvaldefprocesoevaluativoModel();			
		}
		
		public function ExisteProcesoDefinido() {	  
			$existe = $this->objDefProcesoModel->ExisteProcesoDefinido($this->post['denom']);
			if ($existe)
				return false;
			return true;
		}
		
		public function eliminarDefProcesoEvaluativo(){
			$objDatEvalpreprocesoevaluativo = new DatEvalpreprocesoevaluativo();
			$existe = $objDatEvalpreprocesoevaluativo->existeProceso($this->post['iddefprocesoevaluativo']);
			if ($existe)
				return false;
			return true;
		}
	}
?>