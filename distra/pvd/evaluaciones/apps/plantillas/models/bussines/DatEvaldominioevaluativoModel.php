<?php 
class DatEvaldominioevaluativoModel extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(DatEvaldominioevaluativo $DatEvaldominioevaluativo) 
    { 
            $DatEvaldominioevaluativo->save();
    } 
 
   public function Actualizar(DatEvaldominioevaluativo $DatEvaldominioevaluativo) 
    { 
            $DatEvaldominioevaluativo->save();
    } 
 
   public function Eliminar($DatEvaldominioevaluativo) 
    { 
            $DatEvaldominioevaluativo->delete();
    } 
 }

