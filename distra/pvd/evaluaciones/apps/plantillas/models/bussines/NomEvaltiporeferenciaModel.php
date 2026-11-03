<?php 
class NomEvaltiporeferenciaModel extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(NomEvaltiporeferencia $NomEvaltiporeferencia) 
    { 
            $NomEvaltiporeferencia->save();
    } 
 
   public function Actualizar(NomEvaltiporeferencia $NomEvaltiporeferencia) 
    { 
            $NomEvaltiporeferencia->save();
    } 
 
   public function Eliminar($NomEvaltiporeferencia) 
    { 
            $NomEvaltiporeferencia->delete();
    } 
 }

