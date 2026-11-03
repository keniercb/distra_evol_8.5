<?php
abstract class BaseConfCompproceso extends Doctrine_Record
{
	public function setTableDefinition()
	{
		$this->setTableName('mod_seleccion.conf_compproceso');
		$this->hasColumn('idcompproceso', 'numeric', null, array ('notnull' => true,'primary' => true, 'sequence' => 'mod_seleccion.sec_compproceso'));
		$this->hasColumn('idestructura', 'numeric', null, array ('notnull' => true,'primary' => false));
		$this->hasColumn('idproceso', 'numeric', null, array ('notnull' => true,'primary' => false));
    }
}