<?php 
class DatCl1 extends BaseDatCl1
 { 
   public function setUp() 
    {   parent::setUp(); 
         $this->hasMany('DatCl2', array('local'=>'idcl1','foreign'=>'idcl1')); 

    } 
 
 
}//fin clase 
?>


