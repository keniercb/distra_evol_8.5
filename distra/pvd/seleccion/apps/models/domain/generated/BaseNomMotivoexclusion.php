<?php
abstract class BaseNomMotivoexclusion extends Doctrine_Record
{
	public function setTableDefinition()
	{
		$this->setTableName('mod_seleccion.nom_motivoexclusion');
		$this->hasColumn('idmotivoexclusion', 'numeric', null, array ('notnull' => true,'primary' => true, 'sequence' => 'mod_seleccion.sec_motivoexclusion'));
		$this->hasColumn('denominacion', 'character varying', null, array ('notnull' => true,'primary' => false));
		$this->hasColumn('descripcion', 'character varying', null, array ('notnull' => false,'primary' => false));
		$this->hasColumn('fdesde', 'date', null, array ('notnull' => true,'primary' => false));
		$this->hasColumn('fhasta', 'date', null, array ('notnull' => false,'primary' => false));
		$this->hasColumn('gestion', 'numeric', array('notnull' => true, 'primary' => false));
    }
}