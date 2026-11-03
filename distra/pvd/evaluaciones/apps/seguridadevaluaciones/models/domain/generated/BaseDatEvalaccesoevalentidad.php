<?php 
abstract class BaseDatEvalaccesoevalentidad extends Doctrine_Record{ 
	public function setTableDefinition() 
    { 
		$this->setTableName('mod_evaluaciones.dat_evalaccesoevalentidad'); 
		$this->hasColumn('idevalaccesoevalentidad', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_evaluaciones.sec_dat_evalaccesoevalentidad')); 
		$this->hasColumn('idpersona', 'numeric', null, array('notnull' => true, 'primary' => false)); 
		$this->hasColumn('ver', 'numeric', null, array('notnull' => true, 'primary' => false, 'default'=>1)); 
		$this->hasColumn('modificar', 'numeric', null, array('notnull' => true, 'primary' => false, 'default'=>0));        
		$this->hasColumn('idevalseguridadevalentidad', 'numeric', null, array('notnull' => true, 'primary' => false));		
    }

 }//fin clase 
?>

