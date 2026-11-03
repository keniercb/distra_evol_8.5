<?php 
class DatCl2 extends BaseDatCl2
 { 
   public function setUp() 
    {   parent::setUp(); 
         $this->hasMany('DatCl2indicador', array('local'=>'idcl2','foreign'=>'idcl2')); 
         $this->hasMany('DatCl2desviacion', array('local'=>'idcl2','foreign'=>'idcl2')); 
         $this->hasOne('DatCl1', array('local'=>'idcl1','foreign'=>'idcl1')); 

    } 
 
 
}//fin clase 
?>


