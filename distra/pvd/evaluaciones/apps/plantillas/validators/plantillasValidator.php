<?php
	class plantillasValidator
	{
		public $planilla;
		public $post;

		public function validarModulo()
		{
			return true;
		}

		function PlantillasValidator()
		{
			$this->post = $_POST;
			$this->planilla = new DatEvalplanillasevaluativasModel();
		}

		public function ExisteCodPlanilla()
		{
			$result = $this->planilla->existeCodPlanilla($this->post['cod']);
			if($result)
				return false;
			return true;
		}


		public function PlanillaEnUso()
		{
			$result = $this->planilla->planillaEnUso($this->post['idPlanilla']);

			if($result)
				return false;

			return true;
		}

	}
?>
