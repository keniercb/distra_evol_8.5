<?php 
/* 
* Esta clase ha sido generada por Doctrine Generator 
*/ 
abstract class BaseDatActividadentidadprodcartatechitotarea extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_planifintegracion.dat_actividadentidadprodcartatechitotarea'); 
       $this->hasColumn('idactividadentidadprodcartatechitotarea', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_planifintegracion.sec_actividadentidadprodcartatechitotarea')); 
       $this->hasColumn('idactividadentidadprodcartatec', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('idhito', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('idtarea', 'numeric', null, array('notnull' => true, 'primary' => false)); 
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase

