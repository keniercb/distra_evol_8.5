<?php 
abstract class BaseDimActividad extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_loganalisis.dim_actividad'); 
       $this->hasColumn('idactividad', 'numeric', null, array('notnull' => true, 'primary' => true)); 
       $this->hasColumn('denominacion', 'character varying', 255 , array('notnull' => false, 'primary' => false)); 
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }

