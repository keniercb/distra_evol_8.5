<?php 
abstract class BaseDatEvalindicadoresplanilla extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_evaluaciones.dat_evalindicadoresplanilla'); 
       $this->hasColumn('idindicadorplanilla', 'numeric', null, array('notnull' => true, 'primary' => true)); 
       $this->hasColumn('abreviatura', 'character varying', 50 , array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('ayuda', 'character varying', 255 , array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('calculado', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('idindicador', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('idpadre', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('idplanilla', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('tipo', 'boolean', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('eshoja', 'numeric', null, array('notnull' => false, 'primary' => false)); 
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }