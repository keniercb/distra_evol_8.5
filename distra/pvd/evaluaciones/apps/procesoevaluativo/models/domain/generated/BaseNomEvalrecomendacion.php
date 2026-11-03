<?php 
abstract class BaseNomEvalrecomendacion extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_evaluaciones.nom_evalrecomendacion'); 
       $this->hasColumn('idrecomendacion', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_evaluaciones.sec_evalrecomendacion')); 
       $this->hasColumn('denom', 'character varying', 255 , array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('descripcion', 'character varying', 255 , array('notnull' => false, 'primary' => false)); 
	   $this->hasColumn('fechafin', 'date', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('fechainicio', 'date', null, array('notnull' => true, 'primary' => false));
	   $this->hasColumn('idtiporecomendacion', 'numeric', null, array('notnull' => true, 'primary' => false)); 
	} 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

