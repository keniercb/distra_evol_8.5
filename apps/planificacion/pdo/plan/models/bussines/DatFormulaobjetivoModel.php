<?php 
class DatFormulaobjetivoModel extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(DatFormulaobjetivo $DatFormulaobjetivo) 
    { 
            $DatFormulaobjetivo->save();
    } 
 
   public function Actualizar(DatFormulaobjetivo $DatFormulaobjetivo) 
    { 
            $DatFormulaobjetivo->save();
    } 
 
   public function Eliminar($DatFormulaobjetivo) 
    { 
            $DatFormulaobjetivo->delete();
    } 
 } 
?>

