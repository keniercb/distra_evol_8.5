<?php 
class DatEvalprocesomodelosModel extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(DatEvalprocesomodelos $DatEvalprocesomodelos) 
    { 
            $DatEvalprocesomodelos->save();
    } 
 
   public function Actualizar(DatEvalprocesomodelos $DatEvalprocesomodelos) 
    { 
            $DatEvalprocesomodelos->save();
    } 
 
   public function Eliminar($DatEvalprocesomodelos) 
    { 
            $DatEvalprocesomodelos->delete();
    } 
 }

