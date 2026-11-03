<?php 
abstract class BaseDatEvalpersonarecomendaciones extends Doctrine_Record{ 
	public function setTableDefinition() 
    { 
		$this->setTableName('mod_evaluaciones.dat_evalpersonarecomendaciones');
		$this->hasColumn('idpersonarecomendaciones', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_evaluaciones.sec_dat_evalpersonarecomendaciones'));
		$this->hasColumn('idrecomendacion', 'numeric', null, array('notnull' => true, 'primary' => false));
		$this->hasColumn('idpersonaevaluacion', 'numeric', null, array('notnull' => true, 'primary' => false));
	}

 }//fin clase 
?>

