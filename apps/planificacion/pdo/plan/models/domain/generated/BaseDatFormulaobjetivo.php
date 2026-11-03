<?php 
abstract class BaseDatFormulaobjetivo extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_objetivos.dat_formulaobjetivo'); 
       $this->hasColumn('idformulaobjetivo', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_objetivos.sec_formulaobjetivo')); 
       $this->hasColumn('orden', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('idnomencladorcondicion', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('operador', 'character varying', 1 , array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('signo', 'character varying', 2 , array('notnull' => true, 'primary' => false));
       $this->hasColumn('idcriterioevaluacionobj', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('idindicadorobjcrit', 'numeric', null, array('notnull' => true, 'primary' => false)); 
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

