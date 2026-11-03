<?php
	class recomendacionesValidator
	{
	public $post;
	public $recomendacion;
	public $tiporecomendacion;

		public function RecomendacionesValidator()
		{
			$this->post 				= $_POST;
			$this->recomendacion 		= new NomEvalrecomendacionModel();
			$this->tiporecomendacion 	= new NomEvaltiporecomendacionModel();
		}

		public function ExisteRecomendacion(){
			$result = $this->recomendacion->existeDenominacion($this->post['denom']);
			if($result)
				return false;
			return true;
		}

		public function ExisteTipoRecomendacion(){
			$result = $this->tiporecomendacion->existeDenominacion($this->post['denominacion']);
			if($result)
				return false;
			return true;
		}

		public function RecomendacionEnUso()
		{
			$uso = $this->recomendacion->RecomendacionEnUso($this->post['idrecomendacion']);
			if($uso)
				return false;
			return true;
		}

		public function TipoRecomendacionEnUso()
		{
			$uso = $this->tiporecomendacion->TipoRecoEnUso($this->post['idtiporecomendacion']);
			if($uso)
				return false;
			return true;
		}
	}
?>