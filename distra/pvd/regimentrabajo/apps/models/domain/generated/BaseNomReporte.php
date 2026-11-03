<?php 
abstract class BaseNomReporte extends Doctrine_Record
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_regimentrabajo.nom_reporte');
       $this->hasColumn('idreporte', 'numeric', null, array('notnull' => true, 'primary' => true,'sequence' => 'mod_regimentrabajo.sec_reporte'));
       $this->hasColumn('denominacion', 'character varying', 255 , array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('descripcion', 'character varying', 255 , array('notnull' => false, 'primary' => false));
       $this->hasColumn('fdesde', 'date', null, array('notnull' => false, 'primary' => false));
       $this->hasColumn('fhasta', 'date', null, array('notnull' => false, 'primary' => false));
    }

 }
?>

