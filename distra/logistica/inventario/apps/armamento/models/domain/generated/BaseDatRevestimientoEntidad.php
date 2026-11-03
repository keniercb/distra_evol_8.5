<?php

abstract class BaseDatRevestimientoEntidad extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_loginventario.dat_revestimientoentidad');
        $this->hasColumn(
            'idrevestimientoentidad', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_loginventario.sec_datrevestimientoentidad')
        );
        $this->hasColumn('idrevestimiento', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idestructuracomun', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}

