<?php 
class NomEvalindicadortextoModel extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(NomEvalindicadortexto $NomEvalindicadortexto) 
    { 
            $NomEvalindicadortexto->save();
    } 
 
   public function Actualizar(NomEvalindicadortexto $NomEvalindicadortexto) 
    { 
            $NomEvalindicadortexto->save();
    } 
 
   public function Eliminar($NomEvalindicadortexto) 
    { 
            $NomEvalindicadortexto->delete();
    } 
	
   public function existeCodDenomIndicadorT($cod, $denom) 
    { 
		$existe = NomEvalindicadortexto :: existeCodDenomIndicadorT($cod, $denom);
		if($existe)
			return true;
		else	
			return false;			
    }

   public function indicadorTEnUso($idindicadortexto) 
    { 
		$existe = NomEvalindicadortexto :: IndicadorTEnUso($idindicadortexto);
		if($existe)
			return true;
		else	
			return false;			
    }
 }

