<?php 
class DatEvalseguridadevalentidadModel extends ZendExt_Model 
{
	public function setUp() {
		parent::ZendExt_Model ();
	}
	
	public function Insertar(DatEvalseguridadevalentidad $DatEvalseguridadevalentidad) 
    { 
            $DatEvalseguridadevalentidad->save();
    } 
 
   public function Actualizar(DatEvalseguridadevalentidad $DatEvalseguridadevalentidad) 
    { 
            $DatEvalseguridadevalentidad->save();
    } 
	
	public function EliminarTabla(DatEvalseguridadevalentidad $DatEvalseguridadevalentidad) 
    { 
            $DatEvalseguridadevalentidad->delete();
    } 
 
   public function Eliminar($idevalseguridadevalentidad) 
    { 
		$DatEvalseguridadevalentidad = new DatEvalseguridadevalentidad();
		$DatEvalseguridadevalentidad = $DatEvalseguridadevalentidad->Buscar($idevalseguridadevalentidad);
        $DatEvalseguridadevalentidad->delete();
    }
	
	public function ExisteDatEvalseguridadevalentidad($idpersona, $idpreprocesoevaluativo){
			
		$existe = DatEvalseguridadevalentidad::ExisteDatEvalseguridadevalentidad($idpersona, $idpreprocesoevaluativo);
		if ($existe)
			return true; 
		return false;
	}
	/*public function ExisteDatEvalseguridadevalentidad($idpersona, $idpreprocesoevaluativo, $idestructura){
			
		$existe = DatEvalseguridadevalentidad::ExisteDatEvalseguridadevalentidad($idpersona, $idpreprocesoevaluativo, $idestructura);
		if ($existe)
			return true; 
		return false;
	}*/
}