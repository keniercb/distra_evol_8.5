<?php 
abstract class BaseDatEvalreferenciaregla extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_evaluaciones.dat_evalreferenciaregla'); 
       $this->hasColumn('idreferenciaregla', 'numeric', null, array('notnull' => true, 'primary' => true)); 
       $this->hasColumn('idregla', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('idtiporeferencia', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('orden', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('referencia', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('variable', 'character varying', 50 , array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('version', 'numeric', null, array('notnull' => false, 'primary' => false)); 
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }