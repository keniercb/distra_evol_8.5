<?php 
class DatEvalindicadoresevaluarModel extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(DatEvalindicadoresevaluar $DatEvalindicadoresevaluar) 
    { 
            $DatEvalindicadoresevaluar->save();
    } 
 
   public function Actualizar(DatEvalindicadoresevaluar $DatEvalindicadoresevaluar) 
    { 
            $DatEvalindicadoresevaluar->save();
    } 
 
   public function Eliminar($DatEvalindicadoresevaluar) 
    { 
            $DatEvalindicadoresevaluar->delete();
    } 
 }

