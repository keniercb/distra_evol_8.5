<?php
abstract class BaseDatCandidato extends Doctrine_Record
{
	public function setTableDefinition()
	{
		$this->setTableName('mod_seleccion.dat_candidato');
		$this->hasColumn('idcandidato', 'numeric', null, array ('notnull' => true,'primary' => true, 'sequence' => 'mod_seleccion.sec_candidato'));
		$this->hasColumn('idproceso', 'numeric', null, array ('notnull' => true,'primary' => false));
		$this->hasColumn('idpersona', 'numeric', null, array ('notnull' => true,'primary' => false));
		$this->hasColumn('fdesde', 'date', null, array ('notnull' => true,'primary' => false));
		$this->hasColumn('fhasta', 'date', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('idviareclutamiento', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('observacion', 'character varying', null, array ('notnull' => false,'primary' => false));
		$this->hasColumn('contratado', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('idprocesoorigen', 'numeric', null, array ('notnull' => false,'primary' => false));
		$this->hasColumn('idusuario', 'numeric', null, array ('notnull' => false,'primary' => false));
    }
}
