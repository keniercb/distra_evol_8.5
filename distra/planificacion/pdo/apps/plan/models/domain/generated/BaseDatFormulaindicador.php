<?php 
abstract class BaseDatFormulaindicador extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_objetivos.dat_formulaindicador'); 
       $this->hasColumn('idformulaindicador', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_objetivos.sec_formulaindicador')); 
       $this->hasColumn('orden', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('valor', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('operador', 'character varying', 1 , array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('signo', 'character varying', 2 , array('notnull' => true, 'primary' => false));
       $this->hasColumn('idcriterioevaluacionind', 'numeric', null, array('notnull' => true, 'primary' => false));
       $this->hasColumn('idcriteriomedida', 'numeric', null, array('notnull' => true, 'primary' => false));  
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

