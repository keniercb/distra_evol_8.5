<?php 
class DatDesagregacionindplanModel extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(DatDesagregacionindplan $DatDesagregacionindplan) 
    { 
            $DatDesagregacionindplan->save();
    } 
 
   public function Actualizar(DatDesagregacionindplan $DatDesagregacionindplan) 
    { 
            $DatDesagregacionindplan->save();
    } 
 
   public function Eliminar($DatDesagregacionindplan) 
    { 
            $DatDesagregacionindplan->delete();
    } 
 }

