<?php 
class DatFormulaobjetivo extends BaseDatFormulaobjetivo
 { 
   public function setUp() 
    {   parent::setUp(); 
         $this->hasOne('DatCriterioevaluacionobj', array('local'=>'idcriterioevaluacionobj','foreign'=>'idcriterioevaluacionobj')); 
         $this->hasOne('DatIndicadorobjcrit', array('local'=>'idindicadorobjcrit','foreign'=>'idindicadorobjcrit')); 

    } 
 
 
}//fin clase 
?>


