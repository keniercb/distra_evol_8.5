<?php 
abstract class BaseNomEvaltipoprocesoevaluativo extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_evaluaciones.nom_evaltipoprocesoevaluativo'); 
       $this->hasColumn('idtipoprocesoevaluativo', 'numeric', null, array('notnull' => true, 'primary' => true)); 
       $this->hasColumn('autoevaluacion', 'boolean', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('comisionevaluacion', 'boolean', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('denom', 'character varying', 255 , array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('descripcion', 'character varying', 255 , array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('evaluadoresevaluados', 'boolean', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('fechafin', 'date', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('fechainicio', 'date', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('orden', 'boolean', null, array('notnull' => false, 'primary' => false)); 
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

