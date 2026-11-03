<?php
abstract class BaseConfTecnica extends Doctrine_Record
{
	public function setTableDefinition()
	{
		$this->setTableName('mod_seleccion.conf_tecnica');
		$this->hasColumn('idtecnica', 'numeric', null, array ('notnull' => true,'primary' => true, 'sequence' => 'mod_seleccion.sec_tecnica'));
		$this->hasColumn('idplanilla', 'numeric', null, array ('notnull' => true,'primary' => false));
    }
}