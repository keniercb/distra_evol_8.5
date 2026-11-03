<?php 
abstract class BaseDatEvaldefprocesoevaluativo extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_evaluaciones.dat_evaldefprocesoevaluativo'); 
       $this->hasColumn('iddefprocesoevaluativo', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_evaluaciones.sec_dat_evaldefprocesoevaluativo')); 
       $this->hasColumn('denom', 'character varying', 255 , array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('descripcion', 'character varying', 255 , array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('fechacomienzo', 'date', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('idperiodoevaluativo', 'numeric', null, array('notnull' => true, 'primary' => false));
       $this->hasColumn('idescala', 'numeric', null, array('notnull' => true, 'primary' => false));
       $this->hasColumn('idtipoprocesoevaluativo', 'numeric', null, array('notnull' => true, 'primary' => false));
       $this->hasColumn('opinionevaluado', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('puedereclamar', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       
    }
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }
