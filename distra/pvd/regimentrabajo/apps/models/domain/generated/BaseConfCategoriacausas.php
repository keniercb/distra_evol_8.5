<?php 
abstract class BaseConfCategoriacausas extends Doctrine_Record
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_regimentrabajo.conf_categoriacausas');
       $this->hasColumn('idcategoriacausa', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_regimentrabajo.sec_conf_categoriacausas'));
       $this->hasColumn('idcategoria', 'numeric' , array('notnull' => true, 'primary' => false));
       $this->hasColumn('idcausa', 'numeric' , array('notnull' => true, 'primary' => false));
    }
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

