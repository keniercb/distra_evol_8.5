<?php

abstract class BaseDatDocumento extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logistica.dat_documento');
        $this->hasColumn(
            'iddocumento', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logistica.sec_datdocumento')
        );
        $this->hasColumn('anno', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cronologia', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estado', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechacontable', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('iddoc', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idejercicio', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idperiodo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idoperacion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idusuario', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nrodoc', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('numeroref', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('observaciones', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('controlfirma', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('hora', 'time without time zone', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('version', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestructuracomun', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('aprobadopor', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcomprobante', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idnodo', 'character varying', 50, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idespecialidad', 'numeric', null, array('notnull' => false, 'primary' => false));
		$this->hasColumn('iduebdestino', 'numeric', null, array('notnull' => false, 'primary' => false));
		$this->hasColumn('firmado', 'numeric', null, array('notnull' => false, 'primary' => false));
		$this->hasColumn('idbloqueousuario', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('uuidflag', 'character varying', null, array('notnull' => false, 'primary' => false));
    }

    public function setUp()
    {
        parent::setUp();
    }

}
