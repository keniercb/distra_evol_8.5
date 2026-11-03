<?php 
abstract class BaseNomEvalindicadorimagen extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_evaluaciones.nom_evalindicadorimagen'); 
       $this->hasColumn('idindicadorimagen', 'numeric', null, array('notnull' => true, 'primary' => true)); 
       $this->hasColumn('codigo', 'character varying', 20 , array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('denom', 'bytea', null, array('notnull' => true, 'primary' => false)); 
	   $this->hasColumn('nombre', 'character varying', 255 , array('notnull' => true, 'primary' => false));	   
	   $this->hasColumn('extension', 'character varying', 10 , array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('descripcion', 'character varying', 255 , array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('fechafin', 'date', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('fechainicio', 'date', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('iddominioevaluativo', 'numeric', null, array('notnull' => true, 'primary' => false)); 
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }