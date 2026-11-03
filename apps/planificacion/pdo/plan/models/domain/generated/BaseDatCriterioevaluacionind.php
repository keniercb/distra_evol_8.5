<?php 
abstract class BaseDatCriterioevaluacionind extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_objetivos.dat_criterioevaluacionind'); 
       $this->hasColumn('idcriterioevaluacionind', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_objetivos.sec_criterioevaluacionind')); 
       $this->hasColumn('idindicadorobjcrit', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('idnomencladorcriterioeval', 'numeric', null, array('notnull' => true, 'primary' => false)); 
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

