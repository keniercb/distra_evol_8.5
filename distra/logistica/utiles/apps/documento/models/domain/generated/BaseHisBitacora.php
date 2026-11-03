<?php

abstract class BaseHisBitacora extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logistica.his_bitacora');

        $this->hasColumn('iddocumento', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('fechacontable', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idusuario', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('operacion', 'character varying', 100, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fecha', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('hora', 'time without time zone', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estado', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('denomestado', 'character varying', 100, array('notnull' => false, 'primary' => false));


    }

    public function Setup()
    {
        parent::setUp();
    }

}
