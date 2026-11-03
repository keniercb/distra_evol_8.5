<?php 
abstract class BaseConfEstructuratempus extends Doctrine_Record
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_regimentrabajo.conf_estructuratempus');
       $this->hasColumn('idestructuratempus', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_regimentrabajo.sec_conf_estructuratempus'));
       $this->hasColumn('idestructura', 'numeric' , array('notnull' => true, 'primary' => false));
       $this->hasColumn('dirapp', 'character varying' , array('notnull' => false, 'primary' => false));
    }
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

