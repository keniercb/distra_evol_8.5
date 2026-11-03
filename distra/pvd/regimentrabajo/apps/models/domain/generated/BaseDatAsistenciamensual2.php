<?php 
abstract class BaseDatAsistenciamensual extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_regimentrabajo.dat_asistenciamensual'); 
       $this->hasColumn('idasistenciamensual', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_regimentrabajo.sec_dat_asistenciamensual')); 
       $this->hasColumn('idpersona', 'numeric',19, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('registro', 'varchar', array('notnull' => false, 'primary' => false));
	   $this->hasColumn('fecha', 'numeric', 6 , array('notnull' => true, 'primary' => false));
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

