<?php 
abstract class BaseDatPeriodomes extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_regimentrabajo.dat_periodomes'); 
       $this->hasColumn('idperiodomes', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_regimentrabajo.sec_periodomes'));        
	   $this->hasColumn('anno', 'numeric', 4 , array('notnull' => false, 'primary' => false));
	   $this->hasColumn('mes', 'numeric', 2 , array('notnull' => false, 'primary' => false));
	   $this->hasColumn('fdesde', 'date' , array('notnull' => false, 'primary' => false)); 
	   $this->hasColumn('fhasta', 'date' , array('notnull' => false, 'primary' => false)); 
    }
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

