<?php
abstract class BaseNomComite extends Doctrine_Record
{
	public function setTableDefinition()
	{
		$this->setTableName('mod_seleccion.nom_comite');
		$this->hasColumn('idcomite', 'numeric', null, array ('notnull' => true,'primary' => true, 'sequence' => 'mod_seleccion.sec_comite'));
		$this->hasColumn('denominacion', 'character varying', null, array ('notnull' => true,'primary' => false));
		$this->hasColumn('descripcion', 'character varying', null, array ('notnull' => false,'primary' => false));
		$this->hasColumn('fdesde', 'date', null, array ('notnull' => true,'primary' => false));
		$this->hasColumn('fhasta', 'date', null, array ('notnull' => false,'primary' => false));
    }
}