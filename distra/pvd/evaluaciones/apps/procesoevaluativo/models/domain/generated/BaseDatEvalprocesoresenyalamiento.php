<?php 
abstract class BaseDatEvalprocesoresenyalamiento extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_evaluaciones.dat_evalprocesoresenyalamiento'); 
       $this->hasColumn('idprocesoresenyalamiento', 'numeric', null, array('notnull' => true, 'primary' => true)); 
       $this->hasColumn('iddefprocesoevaluativo', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('idsenyalamiento', 'numeric', null, array('notnull' => true, 'primary' => false)); 
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

