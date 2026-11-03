<?php 
class DatCl2Model extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(DatCl2 $DatCl2) 
    { 
            $DatCl2->save();
    } 
 
   public function Actualizar(DatCl2 $DatCl2) 
    { 
            $DatCl2->save();
    } 
 
   public function Eliminar($DatCl2) 
    { 
            $DatCl2->delete();
    } 
 } 
?>

