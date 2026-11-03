<?php
abstract class BaseDatEvalpersonaevaluacionfinal extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_evaluaciones.dat_evalpersonaevaluacionfinal'); 
       $this->hasColumn('idevalpersonaevaluacionfinal', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_evaluaciones.sec_dat_evalescalavaloresnumericos')); 
       $this->hasColumn('idpersonaevaluacion', 'numeric', null , array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('idmodelo', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('idpreprocesoevaluativo', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('resultado', 'text', null , array('notnull' => true, 'primary' => false)); 
       
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>
