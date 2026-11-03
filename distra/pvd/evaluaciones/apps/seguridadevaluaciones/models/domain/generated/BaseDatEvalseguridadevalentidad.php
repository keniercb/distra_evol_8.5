<?php 
abstract class BaseDatEvalseguridadevalentidad extends Doctrine_Record{ 
	public function setTableDefinition() 
    { 
		$this->setTableName('mod_evaluaciones.dat_evalseguridadevalentidad'); 
		$this->hasColumn('idevalseguridadevalentidad', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_evaluaciones.sec_dat_evalseguridadevalentidad')); 
		$this->hasColumn('identidad', 'numeric', null, array('notnull' => true, 'primary' => false)); 
		$this->hasColumn('idpersona', 'numeric', null, array('notnull' => true, 'primary' => false)); 
		$this->hasColumn('formaevaluacion', 'numeric', null, array('notnull' => true, 'primary' => false, 'default'=>1));        
		$this->hasColumn('idpreprocesoevaluativo', 'numeric', null, array('notnull' => true, 'primary' => false, 'default'=>1));
		$this->hasColumn('todo', 'numeric', null, array('notnull' => true, 'primary' => false)); 
		$this->hasColumn('tipopersona', 'numeric', null, array('notnull' => true, 'primary' => false)); 
    } 
	
 }//fin clase 
?>

