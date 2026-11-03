<?php 
class DatDesagregacionequipoplanModel extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(DatDesagregacionequipoplan $DatDesagregacionequipoplan) 
    { 
            $DatDesagregacionequipoplan->save();
    } 
 
   public function Actualizar(DatDesagregacionequipoplan $DatDesagregacionequipoplan) 
    { 
            $DatDesagregacionequipoplan->save();
    } 
 
   public function Eliminar($DatDesagregacionequipoplan) 
    { 
            $DatDesagregacionequipoplan->delete();
    } 
 }

