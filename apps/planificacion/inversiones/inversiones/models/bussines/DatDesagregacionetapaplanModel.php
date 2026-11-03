<?php 
class DatDesagregacionetapaplanModel extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(DatDesagregacionetapaplan $DatDesagregacionetapaplan) 
    { 
            $DatDesagregacionetapaplan->save();
    } 
 
   public function Actualizar(DatDesagregacionetapaplan $DatDesagregacionetapaplan) 
    { 
            $DatDesagregacionetapaplan->save();
    } 
 
   public function Eliminar($DatDesagregacionetapaplan) 
    { 
            $DatDesagregacionetapaplan->delete();
    } 
 }

