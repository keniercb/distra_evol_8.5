<?php 
abstract class BaseConfTipocontratosituacion extends Doctrine_Record
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_regimentrabajo.conf_tipocontratosituacion');
       $this->hasColumn('idtipocontratosituacion', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_regimentrabajo.sec_conf_tipocontratosituacion'));
       $this->hasColumn('idconcepto', 'numeric' , array('notnull' => true, 'primary' => false));
       $this->hasColumn('idtipocontrato', 'numeric' , array('notnull' => true, 'primary' => false));
       $this->hasColumn('idsituacion', 'numeric' , array('notnull' => false, 'primary' => false));
    }
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

