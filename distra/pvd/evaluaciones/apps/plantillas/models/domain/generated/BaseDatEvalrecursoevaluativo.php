<?php 
abstract class BaseDatEvalrecursoevaluativo extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_evaluaciones.dat_evalrecursoevaluativo'); 
       $this->hasColumn('idrecursoevaluativo', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_evaluaciones.sec_recursoevaluativo')); 
       $this->hasColumn('denom', 'character varying', 255 , array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('descripcion', 'character varying', 255 , array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('fechafin', 'date', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('fechainicio', 'date', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('version', 'numeric', null, array('notnull' => false, 'primary' => false)); 
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }