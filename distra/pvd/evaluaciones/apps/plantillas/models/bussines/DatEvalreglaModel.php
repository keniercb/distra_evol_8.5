<?php 
class DatEvalreglaModel extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(DatEvalregla $DatEvalregla) 
    { 
            $DatEvalregla->save();
    } 
 
   public function Actualizar(DatEvalregla $DatEvalregla) 
    { 
            $DatEvalregla->save();
    } 
 
   public function Eliminar($DatEvalregla) 
    { 
            $DatEvalregla->delete();
    } 
	
	public function existeRegla($idplanilla, $denom) {
		$existe = DatEvalregla::existeRegla($idplanilla, $denom);
		if ($existe)
			return true; 
		return false;
	}
	
	public function reglaEnUso($idregla) {
		$existe = DatEvalregla::reglaEnUso($idregla);
		if ($existe)
			return true; 
		return false;
	}
	
	public function reglaEnUsoHecho($idregla) {
		$existe = DatEvalregla::reglaEnUsoHecho($idregla);
		if ($existe)
			return true; 
		return false;
	}
	
	public function getIdRegla($idplanilla, $denom){
		$regla = DatEvalregla::getRegla($idplanilla, $denom);
		return $regla[0]['idregla'];
	}
	
	public function getRegla($idregla){
		return $DatEvalregla = Doctrine::getTable( 'DatEvalregla' )->find ( $idregla );		
	}
 }

