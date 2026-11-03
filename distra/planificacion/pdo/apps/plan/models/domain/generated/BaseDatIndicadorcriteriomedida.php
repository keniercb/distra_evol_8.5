<?php 
abstract class BaseDatIndicadorcriteriomedida extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_objetivos.dat_indicadorcriteriomedida'); 
       $this->hasColumn('idindicadorcriteriomedida', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_objetivos.sec_indicadorcriteriomedida')); 
       $this->hasColumn('idindicadorobjcrit', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('idcriteriomedida', 'numeric', null, array('notnull' => true, 'primary' => false)); 
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

