<?php
abstract class BaseDatComite extends Doctrine_Record
{
	public function setTableDefinition()
	{
		$this->setTableName('mod_seleccion.dat_comite');
		$this->hasColumn('idcomitep', 'numeric', null, array ('notnull' => true,'primary' => true, 'sequence' => 'mod_seleccion.sec_comitep'));
		$this->hasColumn('idcomite', 'numeric', null, array ('notnull' => true,'primary' => false));
		$this->hasColumn('estructura', 'numeric', null, array ('notnull' => true,'primary' => false));
		$this->hasColumn('idpersona', 'numeric', null, array ('notnull' => true,'primary' => false));
    }
}