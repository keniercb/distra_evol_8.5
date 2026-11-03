<?php 
abstract class BaseConfUsuarios extends Doctrine_Record
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_regimentrabajo.conf_usuarios');
       $this->hasColumn('id', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_regimentrabajo.sec_conf_usuarios'));
       $this->hasColumn('idusuario', 'numeric' , array('notnull' => true, 'primary' => false));
    }
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

