<?php 
abstract class BaseDatEvalprocesoevaluadores extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_evaluaciones.dat_evalprocesoevaluadores'); 
       $this->hasColumn('idprocesoevaluadores', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_evaluaciones.sec_dat_evalprocesoevaluadores')); 
       $this->hasColumn('idpersona', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('idpreprocesoevaluativo', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('idprocesocomisionevaluacion', 'numeric', null, array('notnull' => false, 'primary' => false)); 
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }