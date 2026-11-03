<?php 
abstract class BaseNomEvalperiodoevaluativo extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_evaluaciones.nom_evalperiodoevaluativo');
       $this->hasColumn('idperiodoevaluativo', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_evaluaciones.sec_evalperiodoevaluativo')); 
       $this->hasColumn('fechafin', 'date', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('fechainicio', 'date', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('medidatiempo', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('periodo', 'numeric', null, array('notnull' => true, 'primary' => false)); 
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

