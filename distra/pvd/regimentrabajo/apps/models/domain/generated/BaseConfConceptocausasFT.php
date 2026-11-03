<?php 
abstract class BaseConfConceptocausasFT extends Doctrine_Record
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_regimentrabajo.conf_conceptocausasFT');
       $this->hasColumn('idconceptocausa', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_regimentrabajo.sec_conf_conceptocausas'));
       $this->hasColumn('idconcepto', 'numeric' , array('notnull' => true, 'primary' => false));
       $this->hasColumn('idcausa', 'numeric' , array('notnull' => true, 'primary' => false));
    }
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

