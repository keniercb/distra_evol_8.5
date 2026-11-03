<?php 
abstract class BaseDatCriterioevaluacionobj extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_objetivos.dat_criterioevaluacionobj'); 
       $this->hasColumn('idcriterioevaluacionobj', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_objetivos.sec_criterioevaluacionobj')); 
       $this->hasColumn('idnomencladorcriterioeval', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('idobjetivo', 'numeric', null, array('notnull' => true, 'primary' => false)); 
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

