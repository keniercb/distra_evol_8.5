<?php 
abstract class BaseConfHabilitarmultiplescausas extends Doctrine_Record
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_regimentrabajo.conf_habilitarmultiplescausas');
       $this->hasColumn('id', 'numeric', null, array('notnull' => true, 'primary' => true));
       $this->hasColumn('habilitado', 'numeric' , array('notnull' => true, 'primary' => false));
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

