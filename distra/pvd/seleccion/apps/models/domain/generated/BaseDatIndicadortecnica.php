<?php
abstract class BaseDatIndicadortecnica extends Doctrine_Record
{
	public function setTableDefinition()
	{
		$this->setTableName('mod_seleccion.dat_indicadortecnica');
		$this->hasColumn('idindicadortecnica', 'numeric', null, array ('notnull' => true,'primary' => true, 'sequence' => 'mod_seleccion.sec_indicadortecnica'));
		$this->hasColumn('idresultadotecnica', 'numeric', null, array ('notnull' => true,'primary' => false));
		$this->hasColumn('idindicadorplanilla', 'numeric', null, array ('notnull' => true,'primary' => false));
		$this->hasColumn('resultado', 'numeric', null, array ('notnull' => true,'primary' => false));
		$this->hasColumn('complemento', 'character varying', null, array ('notnull' => false,'primary' => false));		
    }
}