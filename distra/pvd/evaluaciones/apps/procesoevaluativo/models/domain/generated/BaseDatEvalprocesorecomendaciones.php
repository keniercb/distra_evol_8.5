<?php 
abstract class BaseDatEvalprocesorecomendaciones extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_evaluaciones.dat_evalprocesorecomendaciones'); 
       $this->hasColumn('idprocesorecomendaciones', 'numeric', null, array('notnull' => true, 'primary' => true)); 
       $this->hasColumn('iddefprocesoevaluativo', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('idrecomendacion', 'numeric', null, array('notnull' => true, 'primary' => false)); 
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

