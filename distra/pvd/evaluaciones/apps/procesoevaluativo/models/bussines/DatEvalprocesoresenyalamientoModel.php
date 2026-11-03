<?php 
class DatEvalprocesoresenyalamientoModel extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(DatEvalprocesoresenyalamiento $DatEvalprocesoresenyalamiento) 
    { 
            $DatEvalprocesoresenyalamiento->save();
    } 
 
   public function Actualizar(DatEvalprocesoresenyalamiento $DatEvalprocesoresenyalamiento) 
    { 
            $DatEvalprocesoresenyalamiento->save();
    } 
 
   public function Eliminar($DatEvalprocesoresenyalamiento) 
    { 
            $DatEvalprocesoresenyalamiento->delete();
    } 
	  
 }
