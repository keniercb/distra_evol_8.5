<?php 
abstract class BaseDatApa extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_regimentrabajo.dat_apa'); 
       $this->hasColumn('idapa', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_regimentrabajo.sec_dat_apa')); 
       $this->hasColumn('idpersona', 'numeric',19, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('mes', 'numeric', 2 , array('notnull' => true, 'primary' => false)); 
	   $this->hasColumn('anno', 'numeric', 4 , array('notnull' => true, 'primary' => false));
       $this->hasColumn('idcausa', 'numeric', 19, array('notnull' => true, 'primary' => false));
       $this->hasColumn('horas', 'numeric', 3, array('notnull' => true, 'primary' => false));     
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

