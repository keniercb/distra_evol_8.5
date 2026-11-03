<?php 
class DatCl2desviacion extends BaseDatCl2desviacion
 { 
   public function setUp() 
    {   parent::setUp(); 
         $this->hasOne('DatCl2', array('local'=>'idcl2','foreign'=>'idcl2')); 

    } 
 
 
}//fin clase 
?>


