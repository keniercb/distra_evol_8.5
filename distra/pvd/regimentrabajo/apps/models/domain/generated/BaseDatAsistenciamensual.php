<?php 
abstract class BaseDatAsistenciamensual extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_regimentrabajo.dat_asistenciamensual'); 
       $this->hasColumn('idasistenciamensual', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_regimentrabajo.sec_asistenciamensual'));
       $this->hasColumn('idestructura', 'numeric', array('notnull' => true, 'primary' => false));
       $this->hasColumn('fdesde', 'date', array('notnull' => true, 'primary' => false));
       $this->hasColumn('fhasta', 'date', array('notnull' => true, 'primary' => false));
	   $this->hasColumn('asistencia', 'json', array('notnull' => true, 'primary' => false));
	   $this->hasColumn('apa', 'json', array('notnull' => true, 'primary' => false));
    }
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

