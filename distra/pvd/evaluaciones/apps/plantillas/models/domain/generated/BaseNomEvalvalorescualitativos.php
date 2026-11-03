<?php 
abstract class BaseNomEvalvalorescualitativos extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_evaluaciones.nom_evalvalorescualitativos'); 
       $this->hasColumn('idvalorescualitativos', 'numeric', null, array('notnull' => true, 'primary' => true)); 
       $this->hasColumn('denom', 'character varying', 255 , array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('desde', 'date', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('hasta', 'date', null, array('notnull' => false, 'primary' => false)); 
	   $this->hasColumn('descripcion', 'character varying', 255 , array('notnull' => false, 'primary' => false)); 
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }