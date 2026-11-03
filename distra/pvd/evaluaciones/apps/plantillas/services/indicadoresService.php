<?php
class indicadoresService extends ZendExt_Model {
	
	public function GetIndicadoresPorPlanilla($idplanilla, $idnodopadre) {
		$aux = DatEvalindicadoresplanilla::GetIndicadoresPorPlanilla($idplanilla, $idnodopadre);
		return $aux;
	}
	
	public function GetArrIndicadoresTextPorId($arrIndTexto) {
		$aux = NomEvalindicadortexto::getArrIndicadoresPorId($arrIndTexto);
		return $aux;
	}
	public function GetArrIndicadoresImagenPorId($arrIndImagen) {
		$aux = NomEvalindicadorimagen::getArrIndicadoresPorId($arrIndImagen);
		return $aux;
	}
	
	public function SincronizarImgBDconFicheroServer($idindicadorimagen) {
		$aux = NomEvalindicadorimagenModel::SincronizarImgBDconFicheroServer($idindicadorimagen);
		return $aux;
	}

	public function verificarImgArchivo($nombreArchivo) {
		$aux = NomEvalindicadorimagenModel::verificarImgArchivo($nombreArchivo);
		return $aux;
	}
	
	public function obtenerListadoIndicadoresXPlanilla($idplanilla){
		$aux = DatEvalindicadoresplanilla::obtenerListadoIndicadoresXPlanilla($idplanilla);
		return $aux;
	}
	
	public function buscarIndicador($idindicadorplanilla){
		$aux = DatEvalindicadoresplanilla::Buscar($idindicadorplanilla);
		return $aux;
	}
	
}

?>