<?php 
abstract class BaseNomCausa extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_regimentrabajo.nom_causa'); 
       $this->hasColumn('idcausa', 'numeric', 19, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_regimentrabajo.sec_nom_causa'));
       $this->hasColumn('denominacion', 'character varying',255, array('notnull' => true, 'primary' => false));
       $this->hasColumn('descripcion', 'text', array('notnull' => false, 'primary' => false));
	   $this->hasColumn('fdesde', 'date', array('notnull' => false, 'primary' => false));
	   $this->hasColumn('fhasta', 'date', array('notnull' => false, 'primary' => false));
	   $this->hasColumn('abreviatura', 'character varying',5, array('notnull' => false, 'primary' => false));
	   $this->hasColumn('tieneentradasalida', 'numeric',1, array('notnull' => false, 'primary' => false));
	   $this->hasColumn('tieneperiodo', 'numeric',1, array('notnull' => false, 'primary' => false));
       $this->hasColumn('descuenta', 'numeric',1, array('notnull' => false, 'primary' => false));
	   $this->hasColumn('color', 'character varying',7, array('notnull' => false, 'primary' => false));
       $this->hasColumn('idcategoria', 'numeric',19, array('notnull' => false, 'primary' => false));
       $this->hasColumn('eliminar', 'numeric',1, array('notnull' => false, 'primary' => false));
       $this->hasColumn('idpadre', 'numeric',19, array('notnull' => false, 'primary' => false));
       $this->hasColumn('afectasalario', 'numeric',1, array('notnull' => false, 'primary' => false));
       $this->hasColumn('modifica', 'numeric',1, array('notnull' => false, 'primary' => false));
       $this->hasColumn('cantincidencias', 'numeric',2, array('notnull' => false, 'primary' => false));


     
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

