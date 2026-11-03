<?php 
abstract class BaseDatEvalhecho extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_evaluaciones.dat_evalhecho'); 
       $this->hasColumn('idhecho', 'numeric', null, array('notnull' => true, 'primary' => true)); 
       $this->hasColumn('idmodelo', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('idexpresionmatematica', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('idvalorescualitativos', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('orden', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('version', 'numeric', null, array('notnull' => false, 'primary' => false)); 
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }