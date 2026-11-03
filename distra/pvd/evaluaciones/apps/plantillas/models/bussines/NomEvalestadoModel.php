<?php
class NomEvalestadoModel extends ZendExt_Model 
 { 
	public $estado;
 	
   public function NomEvalestadoModel(){
		$this->estado = new NomEvalestado();
        parent::ZendExt_Model();
   }
 
   public function Insertar(NomEvalestado $NomEvalestado) 
    { 
            $NomEvalestado->save();
    } 
 
   public function Actualizar(NomEvalestado $NomEvalestado) 
    { 
            $NomEvalestado->save();
    } 
 
   public function Eliminar($NomEvalestado) 
    { 
            $NomEvalestado->delete();
    } 
	 
 }

