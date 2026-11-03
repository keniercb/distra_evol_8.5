<?php 
class DatEvalreferenciareglaModel extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(DatEvalreferenciaregla $DatEvalreferenciaregla) 
    { 
            $DatEvalreferenciaregla->save();
    } 
 
   public function Actualizar(DatEvalreferenciaregla $DatEvalreferenciaregla) 
    { 
            $DatEvalreferenciaregla->save();
    } 
 
   public function Eliminar($DatEvalreferenciaregla) 
    { 
            $DatEvalreferenciaregla->delete();
    }
	
	public function EliminarPorIdRegla($idregla){
		$objetos = DatEvalreferenciaregla::getEvalRefporIDRegla($idregla);
		foreach($objetos as $objeto){
			$objeto->delete();
		}
	}
 }

