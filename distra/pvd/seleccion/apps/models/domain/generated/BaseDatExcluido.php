<?php
abstract class BaseDatExcluido extends Doctrine_Record
{
	public function setTableDefinition()
	{
		$this->setTableName('mod_seleccion.dat_excluido');
		$this->hasColumn('idexcluido', 'numeric', null, array ('notnull' => true,'primary' => true, 'sequence' => 'mod_seleccion.sec_excluido'));
		$this->hasColumn('idcandidato', 'numeric', null, array ('notnull' => true,'primary' => false));
		$this->hasColumn('fexclusion', 'date', null, array ('notnull' => true,'primary' => false));
		$this->hasColumn('idmotivoexclusion', 'numeric', null, array ('notnull' => false,'primary' => false));
		$this->hasColumn('observexclusion', 'character varying', null, array ('notnull' => false,'primary' => false));
		$this->hasColumn('freincorporacion', 'date', null, array ('notnull' => false,'primary' => false));
		$this->hasColumn('idmotivoreincorporacion', 'numeric', null, array ('notnull' => false,'primary' => false));
		$this->hasColumn('observreincorporacion', 'character varying', null, array ('notnull' => false,'primary' => false));
		$this->hasColumn('tipo', 'numeric', null, array ('notnull' => true,'primary' => false));
    }
}