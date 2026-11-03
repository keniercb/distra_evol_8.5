<?php 
abstract class BaseConfEstructurareloj extends Doctrine_Record
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_regimentrabajo.conf_estructurareloj');
       $this->hasColumn('idestructurareloj', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_regimentrabajo.sec_conf_estructurareloj'));
       $this->hasColumn('idestructura', 'numeric' , array('notnull' => true, 'primary' => false));
       $this->hasColumn('dirserver', 'character varying' , array('notnull' => true, 'primary' => false));
       $this->hasColumn('nombredb', 'character varying' , array('notnull' => true, 'primary' => false));
       $this->hasColumn('usuario', 'character varying' , array('notnull' => true, 'primary' => false));
       $this->hasColumn('contrasena', 'character varying' , array('notnull' => true, 'primary' => false));
    }
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

