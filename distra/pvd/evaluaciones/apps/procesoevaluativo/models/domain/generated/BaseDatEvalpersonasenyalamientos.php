<?php 
abstract class BaseDatEvalpersonasenyalamientos extends Doctrine_Record{ 
	public function setTableDefinition() 
    { 
		$this->setTableName('mod_evaluaciones.dat_evalpersonasenyalamientos');
		$this->hasColumn('idpersonasenyalamientos', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_evaluaciones.sec_dat_evalpersonasenyalamientos'));
		$this->hasColumn('idsenyalamiento', 'numeric', null, array('notnull' => true, 'primary' => false));
		$this->hasColumn('idpersonaevaluacion', 'numeric', null, array('notnull' => true, 'primary' => false));
	}

 }//fin clase 
?>

