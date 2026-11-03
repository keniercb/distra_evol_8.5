<?php 
abstract class BaseDatPeriodoquincena extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_regimentrabajo.dat_periodoquincena'); 
       $this->hasColumn('idperiodoquincena', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_regimentrabajo.sec_periodoquincena'));        
	   $this->hasColumn('anno', 'numeric', 4 , array('notnull' => false, 'primary' => false));
	   $this->hasColumn('mes', 'numeric', 2 , array('notnull' => false, 'primary' => false));
	   $this->hasColumn('fdesdeprimquincena', 'date' , array('notnull' => false, 'primary' => false));
	   $this->hasColumn('fhastaprimquincena', 'date' , array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesdesegquincena', 'date' , array('notnull' => false, 'primary' => false));
        $this->hasColumn('fhastasegquincena', 'date' , array('notnull' => false, 'primary' => false));
    }
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

