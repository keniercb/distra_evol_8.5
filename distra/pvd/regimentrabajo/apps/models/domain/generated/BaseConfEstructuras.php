<?php 
abstract class BaseConfEstructuras extends Doctrine_Record
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_regimentrabajo.conf_estructuras');
       $this->hasColumn('id', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_regimentrabajo.sec_conf_estructuras'));
       $this->hasColumn('idestructura', 'numeric' , array('notnull' => true, 'primary' => false));
       $this->hasColumn('idpadre', 'numeric' , array('notnull' => true, 'primary' => false));
    }
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

