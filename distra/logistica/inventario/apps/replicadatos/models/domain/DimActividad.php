<?php 
class DimActividad extends BaseDimActividad
 { 
   public function setUp() 
    {   parent::setUp(); 
         $this->hasOne('CubRegistronumerico', array('local'=>'idactividad','foreign'=>'idactividad')); 

    } 
 
 
}

