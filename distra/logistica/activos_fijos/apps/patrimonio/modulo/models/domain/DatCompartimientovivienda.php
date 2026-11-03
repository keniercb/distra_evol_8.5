<?php 
class DatCompartimientovivienda extends BaseDatCompartimientovivienda
 { 
   public function setUp() 
    {   parent::setUp(); 
         $this->hasMany('DatRegnumericoactivo', array('local'=>'idregnumerico','foreign'=>'idregnumerico')); 
         $this->hasMany('NomCompartimento', array('local'=>'idcompartimiento','foreign'=>'idcompartimiento')); 

    }
 
 
}//fin clase 
?>


