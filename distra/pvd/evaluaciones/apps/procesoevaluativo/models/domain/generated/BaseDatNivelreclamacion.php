<?php 
abstract class BaseDatNivelreclamacion extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_evaluaciones.dat_nivelreclamacion'); 
	   $this->hasColumn('idnivelreclamacion', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_evaluaciones.sec_nivelreclamacion'));
	   $this->hasColumn('iddefprocesoevaluativo', 'numeric', null, array('notnull' => true, 'primary' => true)); 
       $this->hasColumn('denominacion', 'character varying', 255 , array('notnull' => true, 'primary' => false)); 
	   $this->hasColumn('nivel', 'numeric', null, array('notnull' => true, 'primary' => true)); 
	   $this->hasColumn('tiemporeclamacion', 'numeric', null, array('notnull' => true, 'primary' => false)); 
	   $this->hasColumn('tiemporespuesta', 'numeric', null, array('notnull' => true, 'primary' => false)); 
    }
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }
?>

