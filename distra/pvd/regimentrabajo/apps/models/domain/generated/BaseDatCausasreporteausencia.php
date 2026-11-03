<?php 
abstract class BaseDatCausasreporteausencia extends Doctrine_Record
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_regimentrabajo.dat_causasreporteausencia');
       $this->hasColumn('idcausasreporteausencia', 'numeric', 19, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_regimentrabajo.sec_causasreporteausencia'));
	   $this->hasColumn('idcausa', 'numeric',19, array('notnull' => true, 'primary' => false));
	   $this->hasColumn('idvariablesconfreportescertificaciones', 'numeric',19, array('notnull' => true, 'primary' => false));

    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

