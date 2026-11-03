<?php 
abstract class BaseNomEvalvaloresimagenes extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_evaluaciones.nom_evalvaloresimagenes'); 
       $this->hasColumn('idvaloresimagenes', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_evaluaciones.sec_nom_evalvaloresimagenes')); 
       $this->hasColumn('denom', 'bytea', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('descripcion', 'character varying', 0 , array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('fechafin', 'date', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('fechainicio', 'date', null, array('notnull' => true, 'primary' => false)); 
	   $this->hasColumn('extension', 'character varying', 10 , array('notnull' => true, 'primary' => false)); 
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }