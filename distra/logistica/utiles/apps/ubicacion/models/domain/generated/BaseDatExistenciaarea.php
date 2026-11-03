<?php

abstract class BaseDatExistenciaarea extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('dat_existenciaarea');
        $this->hasColumn(
            'idexistenciaarea', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logubicacion.sec_datexistenciaarea')
        );
        $this->hasColumn('existencia', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cantidaddisponible', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idarea', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}

