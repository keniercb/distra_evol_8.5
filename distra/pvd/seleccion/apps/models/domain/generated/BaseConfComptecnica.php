<?php
abstract class BaseConfComptecnica extends Doctrine_Record
{
	public function setTableDefinition()
	{
		$this->setTableName('mod_seleccion.conf_comptecnica');
		$this->hasColumn('idcomptecnica', 'numeric', null, array ('notnull' => true,'primary' => true, 'sequence' => 'mod_seleccion.sec_comptecnica'));
		$this->hasColumn('idtecnica', 'numeric', null, array ('notnull' => true,'primary' => false));
		$this->hasColumn('idmodelo', 'numeric', null, array ('notnull' => true,'primary' => false));
		$this->hasColumn('idproceso', 'numeric', null, array ('notnull' => true,'primary' => false));
    }
}