<?php 
class DatOtrasInstalaciones extends BaseDatOtrasInstalaciones
 { 
   public function setUp() 
    {   parent::setUp(); 
         $this->hasMany('DatRegnumericoactivo', array('local'=>'idregnumerico','foreign'=>'idregnumerico'));
         $this->hasMany('NomOtrasInstalaciones', array('local'=>'idotrasinstalacionesviv',
             'foreign'=>'idotrasinstalacionesviv'));
    }
 
 
}//fin clase 
?>


