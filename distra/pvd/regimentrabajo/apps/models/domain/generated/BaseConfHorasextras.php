<?php 
abstract class BaseConfHorasextras extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_regimentrabajo.conf_horasextras'); 
       $this->hasColumn('id', 'numeric', null, array('notnull' => true, 'primary' => true)); 
       $this->hasColumn('limite', 'numeric' , array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('denominacion', 'character varying', 255 , array('notnull' => true, 'primary' => false));
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

