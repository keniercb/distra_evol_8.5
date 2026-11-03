<?php
abstract class BaseDatSeguimiento extends Doctrine_Record
{
	public function setTableDefinition()
	{
		$this->setTableName('mod_seleccion.dat_seguimiento');
		$this->hasColumn('idseguimiento', 'numeric', null, array ('notnull' => true,'primary' => true, 'sequence' => 'mod_seleccion.sec_seguimiento'));
		$this->hasColumn('idcandidato', 'numeric', null, array ('notnull' => true,'primary' => false));
		$this->hasColumn('idmotivoseguimiento', 'numeric', null, array ('notnull' => false,'primary' => false));
		$this->hasColumn('fdesde', 'date', null, array ('notnull' => true,'primary' => false));
		$this->hasColumn('fhasta', 'date', null, array ('notnull' => false,'primary' => false));
    }
}