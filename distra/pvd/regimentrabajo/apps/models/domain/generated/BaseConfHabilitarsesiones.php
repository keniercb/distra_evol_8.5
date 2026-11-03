<?php 
abstract class BaseConfHabilitarsesiones extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_regimentrabajo.conf_habilitarsesiones');
       $this->hasColumn('idhabilitarsesion', 'numeric', null, array('notnull' => true, 'primary' => true));
       $this->hasColumn('habsesion', 'numeric' , array('notnull' => true, 'primary' => false));
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

