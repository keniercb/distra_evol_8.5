<?php
abstract class BaseDatProcesocargo extends Doctrine_Record
{
	public function setTableDefinition()
	{
		$this->setTableName('mod_seleccion.dat_procesocargo');
		$this->hasColumn('idprocesocargo', 'numeric', null, array ('notnull' => true,'primary' => true, 'sequence' => 'mod_seleccion.sec_procesocargo'));
		$this->hasColumn('idproceso', 'numeric', null, array ('notnull' => true,'primary' => false));
		$this->hasColumn('idcargo', 'numeric', null, array ('notnull' => true,'primary' => false));
		$this->hasColumn('homologo', 'numeric', null, array ('notnull' => true,'primary' => false));
    }
}