<?php 
abstract class BaseConfCausasadicionesdeduciones extends Doctrine_Record
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_regimentrabajo.conf_causasadicionesdeduciones');
       $this->hasColumn('id', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_regimentrabajo.sec_conf_causasadicionesdeduciones'));
       $this->hasColumn('adiciondeducion', 'numeric' , array('notnull' => true, 'primary' => false));
       $this->hasColumn('idcausa', 'numeric' , array('notnull' => true, 'primary' => false));
    }
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

