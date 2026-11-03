<?php
class ExpinmuebleValidator {
 private $pIntegrator; 
 private $model;
 public $post = array();
	
	public function NomencladorValidator()
	{
		$this->post = $_POST;
		$this->pIntegrator = ZendExt_IoC_Inter::getInstance();
		$this->model = new DatDocumentoInmuebles();
	}	
	//------Fin de las validaciones de plan aprobado
}

?>
