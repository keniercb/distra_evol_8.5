<?php 
abstract class BaseConfFondodetiempo extends Doctrine_Record
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_regimentrabajo.conf_fondodetiempo');
       $this->hasColumn('id', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_regimentrabajo.sec_conf_fondodetiempo'));
       $this->hasColumn('idcategoria', 'numeric' , array('notnull' => true, 'primary' => false));
       $this->hasColumn('fondodetiempo', 'numeric' , array('notnull' => true, 'primary' => false));
    }
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

