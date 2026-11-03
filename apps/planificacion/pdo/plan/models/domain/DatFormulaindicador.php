<?php 
class DatFormulaindicador extends BaseDatFormulaindicador
 { 
   public function setUp() 
    {   parent::setUp(); 
         $this->hasOne('DatCriterioevaluacionind', array('local'=>'idcriterioevaluacionind','foreign'=>'idcriterioevaluacionind')); 
         $this->hasOne('DatCriteriomedida', array('local'=>'idcriteriomedida','foreign'=>'idcriteriomedida')); 

    } 
 
 
}//fin clase 
?>


