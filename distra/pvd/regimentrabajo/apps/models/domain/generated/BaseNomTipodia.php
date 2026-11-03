<?php 
abstract class BaseNomTipodia extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_regimentrabajo.nom_tipodedia'); 
       $this->hasColumn('idtipodedia', 'numeric', null, array('notnull' => true, 'primary' => true)); 
       $this->hasColumn('denominacion', 'character varying', 255 , array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('descripcion', 'character varying', 255 , array('notnull' => false, 'primary' => false)); 
	   $this->hasColumn('color', 'varchar', 7 , array('notnull' => true, 'primary' => false));
       $this->hasColumn('fdesde', 'date', null, array('notnull' => false, 'primary' => false));
       $this->hasColumn('fhasta', 'date', null, array('notnull' => false, 'primary' => false));
       $this->hasColumn('abreviatura', 'varchar', 3, array('notnull' => true, 'primary' => false));
       $this->hasColumn('trabajo', 'numeric', 1, array('notnull' => true, 'primary' => false));
       $this->hasColumn('feriado', 'numeric', 1, array('notnull' => true, 'primary' => false));
    }

 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

