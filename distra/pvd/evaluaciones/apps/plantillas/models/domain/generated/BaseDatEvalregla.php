<?php 
abstract class BaseDatEvalregla extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_evaluaciones.dat_evalregla'); 
       $this->hasColumn('idregla', 'numeric', null, array('notnull' => true, 'primary' => true)); 
       $this->hasColumn('denom', 'character varying', 255, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('descripcion', 'character varying', 255 , array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('expnatural', 'character varying', null , array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('exparreglo', 'character varying', null , array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('idestado', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('idplanilla', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('version', 'numeric', null, array('notnull' => false, 'primary' => false)); 
	   $this->hasColumn('propiedades', 'character varying', null , array('notnull' => true, 'primary' => false)); 
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }