<?php
class DatEvalpersonarecomendacionesModel extends ZendExt_Model {
	public function setUp() {
		parent::ZendExt_Model ();
	}
	
	public function Insertar(DatEvalpersonarecomendaciones $DatEvalpersonarecomendaciones) {
		$DatEvalpersonarecomendaciones->save ();
	}
	
	public function Adicionar($idrecomendacion, $idpersonaevaluacion) {
		$objAux = new DatEvalpersonarecomendaciones();
		$objAux->idrecomendacion = $idrecomendacion;
		$objAux->idpersonaevaluacion = $idpersonaevaluacion;
		$objAux->save ();
	}
	
	public function Actualizar(DatEvalpersonarecomendaciones $DatEvalpersonarecomendaciones) {
		$DatEvalpersonarecomendaciones->save ();
	}
	
	public function Eliminar($idpersonarecomendaciones){ 
		$DatEvalpersonarecomendaciones = Doctrine::getTable( 'DatEvalpersonarecomendaciones' )->find ($idpersonarecomendaciones);
		$DatEvalpersonarecomendaciones->delete();
    }
	
	
}

