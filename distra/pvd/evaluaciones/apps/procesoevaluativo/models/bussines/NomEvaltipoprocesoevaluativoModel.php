<?php 
class NomEvaltipoprocesoevaluativoModel extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(NomEvaltipoprocesoevaluativo $NomEvaltipoprocesoevaluativo) 
    { 
            $NomEvaltipoprocesoevaluativo->save();
    } 
 
   public function Actualizar(NomEvaltipoprocesoevaluativo $NomEvaltipoprocesoevaluativo) 
    { 
            $NomEvaltipoprocesoevaluativo->save();
    } 
 
   public function Eliminar($NomEvaltipoprocesoevaluativo) 
    { 
            $NomEvaltipoprocesoevaluativo->delete();
    } 
	
	public function existeDenominacion($denom){
		$existe = NomEvaltipoprocesoevaluativo :: ExisteDenomTipoProceso($denom);
		if($existe)
			return true;
		return false;
	}
	
	public function TipoProcesoEnUso($id)
	{
	   $valores = NomEvaltipoprocesoevaluativo :: TipoProcesoEnUso($id);
	   if($valores) 
			return true;
	   return false;
	}
 }

