<?php 
abstract class BaseNomIndicadoresbase extends Doctrine_Record
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_regimentrabajo.nom_indicadoresbase');
       $this->hasColumn('idindicadorbase', 'numeric', null, array('notnull' => true, 'primary' => true,'sequence' => 'mod_regimentrabajo.sec_regimentrabajo'));
       $this->hasColumn('denominacion', 'character varying', 255 , array('notnull' => true, 'primary' => false)); 

    }

 }
?>

