<?php 
abstract class BaseNomEvalvaloresnumericos extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_evaluaciones.nom_evalvaloresnumericos'); 
       $this->hasColumn('idvaloresnumericos', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' =>'mod_evaluaciones.sec_evalvaloresnumericos')); 
       $this->hasColumn('denom', 'numeric', null , array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('idescalarangonumerico', 'numeric', null , array('notnull' => true, 'primary' => false)); 
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }