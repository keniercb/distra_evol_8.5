<?php 
abstract class BaseDatEvalindicadoresevaluar extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_evaluaciones.dat_evalindicadoresevaluar'); 
	   $this->hasColumn('idevalindicadoresevaluar', 'numeric', null, array('notnull' => true, 'primary' => true)); 
       $this->hasColumn('idindicadorplanilla', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('complementotextual', 'boolean', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('obligatorio', 'boolean', null, array('notnull' => false, 'primary' => false));
       $this->hasColumn('idescala', 'numeric', null, array('notnull' => true, 'primary' => false));
       $this->hasColumn('version', 'numeric', null, array('notnull' => false, 'primary' => false)); 
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }