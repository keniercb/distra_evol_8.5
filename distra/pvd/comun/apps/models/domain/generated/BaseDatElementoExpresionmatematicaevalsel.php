<?php 
abstract class BaseDatElementoExpresionmatematicaevalsel extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_evaluaciones.dat_elementoexpresionmatematicaevalsel'); 
       $this->hasColumn('idelementoexpresionmatematica', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' =>'mod_utiles.sec_dat_elementoexpresionmatematica')); 
       $this->hasColumn('idexpresionmatematica', 'numeric', null , array('notnull' => true, 'primary' => false)); 
	   $this->hasColumn('elemento', 'string', null, array('fixed' => false, 'notnull' => true, 'primary' => false));
	   $this->hasColumn('tipoelemento', 'numeric', null , array('notnull' => true, 'primary' => false));
	   $this->hasColumn('idindicador', 'numeric', null , array('notnull' => false, 'primary' => false));
	   $this->hasColumn('orden', 'numeric', null , array('notnull' => true, 'primary' => false));
	   $this->hasColumn('elementomostrar', 'string', null, array('fixed' => false, 'notnull' => false, 'primary' => false));
    }   

 }//fin clase 
?>

