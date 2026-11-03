<?php
	class valoresimagenesValidator
	{
	    private $post;
		private $imagenes;		
		public function valoresimagenesValidator()
		{
		    $this->post = $_POST;
			$this->imagenes = new NomEvalvaloresimagenesModel();
		}
		
		public function cumpeCondiciones()
		{
		    $existe = $this->imagenes->TamannoAdecuado($_SESSION["dimensiones"]);
		    if($existe) 
			   return true;
			return false;
		}
		
		
	}
?>