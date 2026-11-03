<?php 
class DatDesagregacionplanModel extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(DatDesagregacionplan $DatDesagregacionplan) 
    { 
            $DatDesagregacionplan->save();
    } 
 
   public function Actualizar(DatDesagregacionplan $DatDesagregacionplan) 
    { 
            $DatDesagregacionplan->save();
    } 
 
   public function Eliminar($DatDesagregacionplan) 
    { 
            $DatDesagregacionplan->delete();
    } 
 }

