<?php 
class DatEvalescalavalorescualitativosModel extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(DatEvalescalavalorescualitativos $DatEvalescalavalorescualitativos) 
    { 
            $DatEvalescalavalorescualitativos->save();
    } 
 
   public function Actualizar(DatEvalescalavalorescualitativos $DatEvalescalavalorescualitativos) 
    { 
            $DatEvalescalavalorescualitativos->save();
    } 
 
   public function Eliminar($DatEvalescalavalorescualitativos) 
    { 
            $DatEvalescalavalorescualitativos->delete();
    } 
 }

