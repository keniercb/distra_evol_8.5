<?php
class DatEvalindicadoresevalfueraprocesoModel extends ZendExt_Model {
	public function setUp() {
		parent::ZendExt_Model ();
	}
	
	public function Insertar(DatEvalindicadoresevalfueraproceso $DatEvalindicadoresevalfueraproceso) {
		$DatEvalindicadoresevalfueraproceso->save ();
	}
	
	public function Actualizar(DatEvalindicadoresevalfueraproceso $DatEvalindicadoresevalfueraproceso) {
		$DatEvalindicadoresevalfueraproceso->save ();
	}
	
	public function getPersonaEvaluacion($idersonaevaluacion){
		return $DatEvalindicadoresevalfueraproceso = Doctrine::getTable('DatEvalindicadoresevalfueraproceso')->find($idersonaevaluacion);		
	}
		
	public function Eliminar($idpersonaevalfueraproceso) {		
        $DatEvalindicadoresevalfueraproceso =$this->getPersonaEvaluacion($idpersonaevalfueraproceso);
		$DatEvalindicadoresevalfueraproceso->delete ();
	}
	
	public function existeIndicadoresEvaluacion($idpersonaevalfueraproceso, $idindicadorplanilla){
		$existe = DatEvalindicadoresevalfueraproceso::getIndicadorEvaluacion($idpersonaevalfueraproceso, $idindicadorplanilla);
		if ($existe)
			return true;
		return false;
	}
	//Devuelve un objeto de tipo Doctrine Table
	public function obtenerIndicadorEvaluacion($idpersonaevalfueraproceso, $idindicadorplanilla){
		$varAux = DatEvalindicadoresevalfueraproceso::obtenerIndicadorEvaluacion($idpersonaevalfueraproceso, $idindicadorplanilla);
		return $varAux;
	}
	//Devuelve un array con los valores
	public function getIndicadorEvaluacion($idpersonaevalfueraproceso, $idindicadorplanilla){
		$varAux = DatEvalindicadoresevalfueraproceso::getIndicadorEvaluacion($idpersonaevalfueraproceso, $idindicadorplanilla);
		return $varAux;
	}
	
	
	

}

