<?php 
abstract class BaseNomTipodocidentidad extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_persona.nom_tipodocidentidad'); 
       $this->hasColumn('idtipodocidentidad', 'numeric', null, array('notnull' => true, 'primary' => true)); 
       $this->hasColumn('denom', 'character varying', 255 , array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('descripcion', 'character varying', 255 , array('notnull' => false, 'primary' => false)); 
	   $this->hasColumn('alfanumerico', 'numeric', 1 , array('notnull' => false, 'primary' => false));
       $this->hasColumn('desde', 'date', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('hasta', 'date', null, array('notnull' => false, 'primary' => false)); 
	   $this->hasColumn('cantminima', 'numeric', 2, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('cantmaxima', 'numeric', 2, array('notnull' => false, 'primary' => false));
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

