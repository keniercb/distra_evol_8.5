<?php
abstract class BaseDatProcesotecnica extends Doctrine_Record
{
	public function setTableDefinition()
	{
		$this->setTableName('mod_seleccion.dat_procesotecnica');
		$this->hasColumn('idprocesotecnica', 'numeric', null, array ('notnull' => true,'primary' => true, 'sequence' => 'mod_seleccion.sec_procesotecnica'));
		$this->hasColumn('idproceso', 'numeric', null, array ('notnull' => true,'primary' => false));
		$this->hasColumn('idtecnica', 'numeric', null, array ('notnull' => true,'primary' => false));
		$this->hasColumn('idmodelo', 'numeric', null, array ('notnull' => true,'primary' => false));
		$this->hasColumn('fdesde', 'date', null, array ('notnull' => true,'primary' => false));
		$this->hasColumn('fhasta', 'date', null, array ('notnull' => false,'primary' => false));
		$this->hasColumn('hito', 'numeric', null, array ('notnull' => false,'primary' => false));
		$this->hasColumn('condicion', 'numeric', null, array ('notnull' => false,'primary' => false));
		$this->hasColumn('valor', 'numeric', null, array ('notnull' => false,'primary' => false));
		$this->hasColumn('orden', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('validez', 'numeric', null, array ('notnull' => false,'primary' => false));
		$this->hasColumn('unidadtiempo', 'numeric', null, array ('notnull' => false,'primary' => false));
	}	
	
}