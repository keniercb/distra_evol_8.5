<?php
abstract class BaseDatProcesocomite extends Doctrine_Record
{
	public function setTableDefinition()
	{
		$this->setTableName('mod_seleccion.dat_procesocomite');
		$this->hasColumn('idprocesocomite', 'numeric', null, array ('notnull' => true,'primary' => true, 'sequence' => 'mod_seleccion.sec_procesocomite'));
		$this->hasColumn('idproceso', 'numeric', null, array ('notnull' => true,'primary' => false));
		$this->hasColumn('idcomision', 'numeric', null, array ('notnull' => true,'primary' => false));
    }
}