<?php
abstract class BaseDatProceso extends Doctrine_Record
{
	public function setTableDefinition()
	{
		$this->setTableName('mod_seleccion.dat_proceso');
		$this->hasColumn('idproceso', 'numeric', null, array ('notnull' => true,'primary' => true, 'sequence' => 'mod_seleccion.sec_proceso'));
		$this->hasColumn('denominacion', 'character varying', null, array ('notnull' => true,'primary' => false));
		$this->hasColumn('recurso', 'numeric', null, array ('notnull' => true,'primary' => false));
		$this->hasColumn('fdesde', 'date', null, array ('notnull' => true,'primary' => false));
		$this->hasColumn('fhasta', 'date', null, array ('notnull' => false,'primary' => false));
		$this->hasColumn('idexpresion', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('idestructura', 'numeric', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('contratar', 'numeric', null, array ('notnull' => true,'primary' => false));
    }
}
