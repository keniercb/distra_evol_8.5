<?php
class reglasService extends ZendExt_Model {
	
	public function BuscarReglasPorPlanilla($idplanilla, $limit, $start){
		$result = DatEvalregla::getReglasPorPlanilla($idplanilla,$limit,$start);
		return ZendExt_ClassStandard::ArrayObject ($result);
	}
	
	public function ValidarExpresion($expresion){
		$result = procesadorModel::validarExpresion($expresion);
		return $result;
	}
	
	public function AdicionarRegla($objRegla){  //$denom, $descripcion, $expnatural, $exppolaca, $idplanilla, $idestado
		/*$objRegla = new DatEvalregla();
		$objRegla->denom = $denom;
		$objRegla->descripcion = $descripcion;
		$objRegla->expnatural = $expnatural;
		$objRegla->exppolaca = $exppolaca;
		$objRegla->idplanilla = $idplanilla;
		$objRegla->idestado = $idestado;*/			
		return DatEvalreglaModel::Insertar($objRegla);
	}
	
}

?>