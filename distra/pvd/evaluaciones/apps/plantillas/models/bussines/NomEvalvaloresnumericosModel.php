<?php 
class NomEvalvaloresnumericosModel extends ZendExt_Model 
 { 
	public function NomEvalvaloresnumericosModel(){		
        parent::ZendExt_Model();
	}
	
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(NomEvalvaloresnumericos $NomEvalvaloresnumericos) 
    { 
		$NomEvalvaloresnumericos->save();
    } 

	public function Actualizar(NomEvalvaloresnumericos $NomEvalvaloresnumericos) 
    { 
		$NomEvalvaloresnumericos->save();
    } 
 
   public function Eliminar($NomEvalvaloresnumericos) 
    { 
		$NomEvalvaloresnumericos->delete();
    }
	
 }

