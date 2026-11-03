<?php 
class DatEvalaccesoevalentidadModel extends ZendExt_Model 
{
	public function setUp() {
		parent::ZendExt_Model ();
	}
	
	public function Insertar(DatEvalaccesoevalentidad $DatEvalaccesoevalentidad) 
    { 
            $DatEvalaccesoevalentidad->save();
    } 
 
   public function Actualizar(DatEvalaccesoevalentidad $DatEvalaccesoevalentidad) 
    { 
            $DatEvalaccesoevalentidad->save();
    } 
 
   public function Eliminar($idevalaccesoevalentidad) 
    { 
		$DatEvalaccesoevalentidad = DatEvalaccesoevalentidad::Buscar($idevalaccesoevalentidad);
		$DatEvalaccesoevalentidad->delete();
    }
	
	public function ExisteDatEvalaccesoevalentidad($idpersona, $idevalseguridadevalentidad){
		$existe = DatEvalaccesoevalentidad::ExisteDatEvalaccesoevalentidad($idpersona, $idevalseguridadevalentidad);
		if ($existe)
			return true; 
		return false;
	}
	
	public function cambiarPermisos($idevalseguridadevalentidad, $tipoPermiso){
		$objAux = DatEvalseguridadevalentidad::Buscar($idevalseguridadevalentidad);
		foreach($objAux->DatEvalaccesoevalentidad as $a){
			$a->ver = 1;
			$a->modificar = $tipoPermiso == 1 ? 0 : 1;
		}
		//print_r($objAux->toArray());die;
		$objAux->save();
	}
}