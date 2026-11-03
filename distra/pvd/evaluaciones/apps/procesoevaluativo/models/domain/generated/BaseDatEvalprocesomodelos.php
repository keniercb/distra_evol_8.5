<?php 
abstract class BaseDatEvalprocesomodelos extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_evaluaciones.dat_evalprocesomodelos'); 
       $this->hasColumn('idevalprocesomodelos', 'numeric', null, array('notnull' => true, 'primary' => true)); 
       $this->hasColumn('iddefprocesoevaluativo', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('idmodelo', 'numeric', null, array('notnull' => true, 'primary' => false)); 
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

