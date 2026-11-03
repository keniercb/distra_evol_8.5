<?php 
abstract class BaseDatEvaldominioevaluativo extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_evaluaciones.dat_evaldominioevaluativo'); 
       $this->hasColumn('iddominioevaluativo', 'numeric', null, array('notnull' => true, 'primary' => true/*, 'sequence' => 'mod_capitalhumano.sec_evaldominioevaluativo'*/)); 
       $this->hasColumn('denom', 'character varying', 255 , array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('descripcion', 'character varying', 255 , array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('idpadre', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('idrecursoevaluativo', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('version', 'numeric', null, array('notnull' => false, 'primary' => false)); 
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }