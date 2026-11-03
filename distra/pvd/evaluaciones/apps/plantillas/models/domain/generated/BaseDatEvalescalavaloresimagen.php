<?php 
abstract class BaseDatEvalescalavaloresimagen extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_evaluaciones.dat_evalescalavaloresimagen'); 
       $this->hasColumn('idevalescalavaloreimagene', 'numeric', null, array('notnull' => true, 'primary' => true)); 
       $this->hasColumn('idescala', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('idvaloresimagenes', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('orden', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('version', 'numeric', null, array('notnull' => false, 'primary' => false)); 
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }