<?php 
class DatCl1Model extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(DatCl1 $DatCl1) 
    { 
            $DatCl1->save();
    } 
 
   public function Actualizar(DatCl1 $DatCl1) 
    { 
            $DatCl1->save();
    } 
 
   public function Eliminar($DatCl1) 
    { 
            $DatCl1->delete();
    } 
 } 
?>

