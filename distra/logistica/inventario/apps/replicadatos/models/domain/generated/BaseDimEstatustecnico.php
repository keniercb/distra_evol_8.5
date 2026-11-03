<?php 
abstract class BaseDimEstatustecnico extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_loganalisis.dim_estatustecnico'); 
       $this->hasColumn('idestatustecnico', 'numeric', null, array('notnull' => true, 'primary' => true)); 
       $this->hasColumn('denominacion', 'character varying', 255 , array('notnull' => false, 'primary' => false)); 
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }

