<?php 
class DatEvalescalarangonumericoModel extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(DatEvalescalarangonumerico $DatEvalescalarangonumerico) 
    { 
		$DatEvalescalarangonumerico->save();
    } 
 
   public function Actualizar(DatEvalescalarangonumerico $DatEvalescalarangonumerico) 
    { 
		$DatEvalescalarangonumerico->save();
    } 
 
   public function Eliminar($DatEvalescalarangonumerico) 
    { 
		$DatEvalescalarangonumerico->delete();
    }
 }

