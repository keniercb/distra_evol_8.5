<?php 
abstract class BaseNomEvaltiporeferencia extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_evaluaciones.nom_evaltiporeferencia'); 
       $this->hasColumn('idtiporeferencia', 'numeric', null, array('notnull' => true, 'primary' => true)); 
       $this->hasColumn('denom', 'character varying', 255 , array('notnull' => true, 'primary' => false)); 
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }