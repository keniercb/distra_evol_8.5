<?php
	class indicadoresValidator
	{
		public $post;
		public $indicadorT;
		public $indicadorI;

		public function validarModulo()
		{
			return true;
		}

		function IndicadoresValidator()
		{
			$this->post = $_POST;
			$this->indicadorT = new NomEvalindicadortextoModel();
			$this->indicadorI = new NomEvalindicadorimagenModel();
		}

		public function existeCodDenomIndicadorT()
		{
			$result = $this->indicadorT->existeCodDenomIndicadorT($this->post['cod'], $this->post['denom']);
			if($result)
				return false;
			return true;
		}

		public function IndicadorTEnUso()
		{
			$result = $this->indicadorT->indicadorTEnUso($this->post['idindicadortexto']);

			if($result)
				return false;
			return true;
		}

		public function ExisteCodIndicadorI()
		{
			$result = $this->indicadorI->existeCodIndicadorI($this->post['codigo']);

			if($result)
				return false;
			return true;
		}

		public function IndicadorIEnUso()
		{
			$result = $this->indicadorI->indicadorIEnUso($this->post['idimagen']);

			if($result)
				return false;
			return true;
		}
	}
?>