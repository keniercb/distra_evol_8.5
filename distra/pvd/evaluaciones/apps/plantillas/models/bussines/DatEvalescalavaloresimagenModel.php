<?php 
class DatEvalescalavaloresimagenModel extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(DatEvalescalavaloresimagen $DatEvalescalavaloresimagen) 
    { 
            $DatEvalescalavaloresimagen->save();
    } 
 
   public function Actualizar(DatEvalescalavaloresimagen $DatEvalescalavaloresimagen) 
    { 
            $DatEvalescalavaloresimagen->save();
    } 
 
   public function Eliminar($DatEvalescalavaloresimagen) 
    { 
            $DatEvalescalavaloresimagen->delete();
    } 
 }

