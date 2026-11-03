<?php 
abstract class BaseConfHorasdias extends Doctrine_Record
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_regimentrabajo.conf_horasdias');
       $this->hasColumn('id', 'numeric', null, array('notnull' => true, 'primary' => true));
       $this->hasColumn('horasdias', 'numeric', 2 , array('notnull' => true, 'primary' => false));
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

