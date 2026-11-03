<?php 
abstract class BaseDatRegistromodelovac extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_regimentrabajo.dat_registromodelovac'); 
       $this->hasColumn('idregistromodelovac', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_regimentrabajo.sec_registromodelovac'));  
	   $this->hasColumn('idpersona', 'numeric', 19 , array('notnull' => true, 'primary' => false));
	   $this->hasColumn('idcargo', 'numeric', 19 , array('notnull' => false, 'primary' => false)); 
	   $this->hasColumn('idarea', 'numeric', 19 , array('notnull' => false, 'primary' => false)); 	   
       $this->hasColumn('anno', 'numeric', 4 , array('notnull' => true, 'primary' => false));
    }
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

