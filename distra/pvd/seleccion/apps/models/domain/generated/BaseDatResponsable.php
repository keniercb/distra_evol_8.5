<?php
abstract class BaseDatResponsable extends Doctrine_Record
{
	public function setTableDefinition()
	{
		$this->setTableName('mod_seleccion.dat_responsable');
		$this->hasColumn('idresponsable', 'numeric', null, array ('notnull' => true,'primary' => true, 'sequence' => 'mod_seleccion.sec_responsable'));
		$this->hasColumn('idprocesotecnica', 'numeric', null, array ('notnull' => true,'primary' => false));
		$this->hasColumn('idcomisionpersona', 'numeric', null, array ('notnull' => true,'primary' => false));
    }
}