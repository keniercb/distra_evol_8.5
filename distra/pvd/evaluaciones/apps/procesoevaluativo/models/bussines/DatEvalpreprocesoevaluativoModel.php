<?php 
class DatEvalpreprocesoevaluativoModel extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(DatEvalpreprocesoevaluativo $DatEvalpreprocesoevaluativo) 
    { 
            $DatEvalpreprocesoevaluativo->save();
    } 
 
   public function Actualizar(DatEvalpreprocesoevaluativo $DatEvalpreprocesoevaluativo) 
    { 
            $DatEvalpreprocesoevaluativo->save();
    } 
 
   public function Eliminar($DatEvalpreprocesoevaluativo) 
    { 
            $DatEvalpreprocesoevaluativo->delete();
    } 
	
 }