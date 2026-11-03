<?php 
class DatEvalprocesocomisionevaluacionModel extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(DatEvalprocesocomisionevaluacion $DatEvalprocesocomisionevaluacion) 
    { 
            $DatEvalprocesocomisionevaluacion->save();
    } 
 
   public function Actualizar(DatEvalprocesocomisionevaluacion $DatEvalprocesocomisionevaluacion) 
    { 
            $DatEvalprocesocomisionevaluacion->save();
    } 
 
   public function Eliminar($DatEvalprocesocomisionevaluacion) 
    { 
            $DatEvalprocesocomisionevaluacion->delete();
    } 
 }

