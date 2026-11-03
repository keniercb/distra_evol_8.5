<?php 
class NomEvaltiposenyalamientoModel extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(NomEvaltiposenyalamiento $NomEvaltiposenyalamiento) 
    { 
            $NomEvaltiposenyalamiento->save();
    } 
 
   public function Actualizar(NomEvaltiposenyalamiento $NomEvaltiposenyalamiento) 
    { 
            $NomEvaltiposenyalamiento->save();
    } 
 
   public function Eliminar($NomEvaltiposenyalamiento) 
    { 
            $NomEvaltiposenyalamiento->delete();
    } 
	
	public function existeDenominacion($denom){
		$existe = NomEvaltiposenyalamiento :: ExisteDenomTipoSenya($denom);
		if($existe)
			return true;
		return false;
	}
	
	public function TipoSenyaEnUso($idtiposenyalamiento)
	{
	   $valores = NomEvaltiposenyalamiento :: TipoSenyalamientoEnUso($idtiposenyalamiento);
	   if($valores) 
			return true;
	   return false;
	}
 }

