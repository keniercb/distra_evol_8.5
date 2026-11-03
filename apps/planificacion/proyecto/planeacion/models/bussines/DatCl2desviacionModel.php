<?php 
class DatCl2desviacionModel extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(DatCl2desviacion $DatCl2desviacion) 
    { 
            $DatCl2desviacion->save();
    } 
 
   public function Actualizar(DatCl2desviacion $DatCl2desviacion) 
    { 
            $DatCl2desviacion->save();
    } 
 
   public function Eliminar($DatCl2desviacion) 
    { 
            $DatCl2desviacion->delete();
    } 
 } 
?>

