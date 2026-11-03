<?php 
class DimEstatustecnico extends BaseDimEstatustecnico
 { 
   public function setUp() 
    {   parent::setUp(); 
         $this->hasOne('CubRegistronumerico', array('local'=>'idestatustecnico','foreign'=>'idestatustecnico')); 

    } 
 
 
}

