<?php 
class DatIndicadorcriteriomedida extends BaseDatIndicadorcriteriomedida
 { 
   public function setUp() 
    {   parent::setUp(); 
         $this->hasOne('DatIndicadorobjcrit', array('local'=>'idindicadorobjcrit','foreign'=>'idindicadorobjcrit')); 

    } 
 
 
}//fin clase 
?>


