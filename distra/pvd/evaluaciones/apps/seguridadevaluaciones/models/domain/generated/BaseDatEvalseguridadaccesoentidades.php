<?php 
abstract class BaseDatEvalseguridadaccesoentidades extends Doctrine_Record{ 
	public function setTableDefinition() 
    { 
		$this->setTableName('mod_evaluaciones.dat_evalseguridadaccesoentidades'); 
		$this->hasColumn('idevalseguridadaccesoentidades', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_evaluaciones.sec_dat_evalseguridadaccesoentidades')); 
		$this->hasColumn('idestructura', 'numeric', null, array('notnull' => true, 'primary' => false)); 
		$this->hasColumn('idpersona', 'numeric', null, array('notnull' => true, 'primary' => false));
    } 

 }//fin clase 
?>

