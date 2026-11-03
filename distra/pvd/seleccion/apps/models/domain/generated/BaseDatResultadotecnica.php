<?php
abstract class BaseDatResultadotecnica extends Doctrine_Record
{
	public function setTableDefinition()
	{
		$this->setTableName('mod_seleccion.dat_resultadotecnica');
		$this->hasColumn('idresultadotecnica', 'numeric', null, array ('notnull' => true,'primary' => true, 'sequence' => 'mod_seleccion.sec_resultadotecnica'));
		$this->hasColumn('idprocesotecnica', 'numeric', null, array ('notnull' => true,'primary' => false));
		$this->hasColumn('idcandidato', 'numeric', null, array ('notnull' => true,'primary' => false));
		$this->hasColumn('fdesde', 'date', null, array ('notnull' => true,'primary' => false));
		$this->hasColumn('fhasta', 'date', null, array ('notnull' => false,'primary' => false));
		$this->hasColumn('resultado', 'numeric', null, array ('notnull' => false,'primary' => false));
		$this->hasColumn('idusuario', 'numeric', null, array ('notnull' => false,'primary' => false));
    }
}