<?php 
class DatCl2indicadorModel extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(DatCl2indicador $DatCl2indicador) 
    { 
            $DatCl2indicador->save();
    } 
 
   public function Actualizar(DatCl2indicador $DatCl2indicador) 
    { 
            $DatCl2indicador->save();
    } 
 
   public function Eliminar($DatCl2indicador) 
    { 
            $DatCl2indicador->delete();
    } 
 } 
?>

