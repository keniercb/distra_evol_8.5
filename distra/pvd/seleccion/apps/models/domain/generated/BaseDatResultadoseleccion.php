<?php
abstract class BaseDatResultadoseleccion extends Doctrine_Record
{
	public function setTableDefinition()
	{
		$this->setTableName('mod_seleccion.dat_resultadoseleccion');
		$this->hasColumn('idresultadoseleccion', 'numeric', null, array ('notnull' => true,'primary' => true, 'sequence' => 'mod_seleccion.sec_resultadoseleccion'));
		$this->hasColumn('idcandidato', 'numeric', null, array ('notnull' => true,'primary' => false));
		$this->hasColumn('faplicacion', 'date', null, array ('notnull' => true,'primary' => false));
		$this->hasColumn('fseleccion', 'date', null, array ('notnull' => false,'primary' => false));
		$this->hasColumn('seleccion', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('ubicacion', 'numeric', null, array ('notnull' => true,'primary' => false));
		$this->hasColumn('idusuario', 'numeric', null, array ('notnull' => false,'primary' => false));
    }
}