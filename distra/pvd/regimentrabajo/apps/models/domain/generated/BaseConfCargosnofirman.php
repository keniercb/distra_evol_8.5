<?php 
abstract class BaseConfCargosnofirman extends Doctrine_Record
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_regimentrabajo.conf_cargosnofirman');
       $this->hasColumn('idcargosnofirman', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_regimentrabajo.sec_conf_cargosnofirman'));
       $this->hasColumn('idcargo', 'numeric' , array('notnull' => true, 'primary' => false));
    }
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

