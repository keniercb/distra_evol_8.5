<?php 
class DatDoccambiomaterialModel extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(DatDoccambiomaterial $DatDoccambiomaterial) 
    { 
            $DatDoccambiomaterial->save();
    } 
 
   public function Actualizar(DatDoccambiomaterial $DatDoccambiomaterial) 
    { 
            $DatDoccambiomaterial->save();
    } 
 
   public function Eliminar($DatDoccambiomaterial) 
    { 
            $DatDoccambiomaterial->delete();
    } 
 } 
?>

