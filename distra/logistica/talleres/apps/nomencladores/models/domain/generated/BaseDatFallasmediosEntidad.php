<?php

abstract class BaseDatFallasmediosEntidad extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.dat_fallasmediosentidad');
        $this->hasColumn(
            'idfallasentidad', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaller.sec_datfallasmediosentidad')
        );
        $this->hasColumn(
            'idfalla', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idestructuracomun', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}



