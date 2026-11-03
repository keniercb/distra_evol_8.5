<?php
class PlanaprobadoValidator {
 private $pIntegrator; 
 public $post = array();
	
	public function NomencladorValidator()
	{
		$this->post = $_POST;
		$this->pIntegrator = ZendExt_IoC_Inter::getInstance();		
	}
	
	public function EditarPlanes()
	{
		$planPropuesto = $this->post['propuesto'];
		$planAprobado = $this->post['aprobado'];
		if ($planAprobado > $planPropuesto)
		return false;
		return true;		
	}	
	//------Fin de las validaciones de plan aprobado
}

?>
