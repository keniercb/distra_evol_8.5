<?php 
abstract class BaseDatCausaindicador extends Doctrine_Record
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_regimentrabajo.dat_causaindicador');
       $this->hasColumn('idcausa', 'numeric', null, array('notnull' => true, 'primary' => true));
       $this->hasColumn('idindicador', 'numeric', null, array('notnull' => true, 'primary' => true));
    }

 }
?>
