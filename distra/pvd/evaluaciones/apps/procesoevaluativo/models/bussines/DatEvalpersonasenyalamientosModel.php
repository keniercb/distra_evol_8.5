<?php
class DatEvalpersonasenyalamientosModel extends ZendExt_Model {
	public function setUp() {
		parent::ZendExt_Model ();
	}
	
	public function Insertar(DatEvalpersonasenyalamientos $DatEvalpersonasenyalamientos) {
		$DatEvalpersonasenyalamientos->save ();
	}
	
	public function Actualizar(DatEvalpersonasenyalamientos $DatEvalpersonasenyalamientos) {
		$DatEvalpersonasenyalamientos->save ();
	}
	
	public function Adicionar($idsenyalamiento, $idpersonaevaluacion) {
		$objAux = new DatEvalpersonasenyalamientos();
		$objAux->idsenyalamiento = $idsenyalamiento;
		$objAux->idpersonaevaluacion = $idpersonaevaluacion;
		$objAux->save();
	}
	
	public function Eliminar($idpersonasenyalamientos){ 
		$DatEvalpersonasenyalamientos = Doctrine::getTable('DatEvalpersonasenyalamientos')->find($idpersonasenyalamientos);
		$DatEvalpersonasenyalamientos->delete();
    }
	
}

