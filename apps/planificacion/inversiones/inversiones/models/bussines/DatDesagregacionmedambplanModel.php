<?php 
class DatDesagregacionmedambplanModel extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(DatDesagregacionmedambplan $DatDesagregacionmedambplan) 
    { 
            $DatDesagregacionmedambplan->save();
    } 
 
   public function Actualizar(DatDesagregacionmedambplan $DatDesagregacionmedambplan) 
    { 
            $DatDesagregacionmedambplan->save();
    } 
 
   public function Eliminar($DatDesagregacionmedambplan) 
    { 
            $DatDesagregacionmedambplan->delete();
    } 
 }

