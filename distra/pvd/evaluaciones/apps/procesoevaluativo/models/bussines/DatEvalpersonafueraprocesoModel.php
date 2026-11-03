<?php
class DatEvalpersonafueraprocesoModel extends ZendExt_Model {
	public function setUp() {
		parent::ZendExt_Model ();
	}
	
	public function Insertar(DatEvalpersonafueraproceso $DatEvalpersonafueraproceso) {
		$DatEvalpersonafueraproceso->save ();
	}
	
	public function Actualizar(DatEvalpersonafueraproceso $DatEvalpersonafueraproceso) {
		$DatEvalpersonafueraproceso->save ();
	}
	
	public function getPersonaEvaluacion($idpersonaevalfueraproceso){
		return $objAux = DatEvalpersonafueraproceso::Buscar($idpersonaevalfueraproceso);
	}
}