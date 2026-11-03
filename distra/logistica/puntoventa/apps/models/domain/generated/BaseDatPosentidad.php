<?php

abstract class BaseDatPosentidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpuntoventa.dat_posentidad');
        $this->hasColumn(
            'idposentidad', 'numeric', null,
            array(
            'notnull' => true, 'primary' => true,
            'sequence' => 'mod_logpuntoventa.sec_datposentidad'
            )
        );
        $this->hasColumn(
            'idestructuracomun', 'numeric', null,
            array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idpos', 'numeric', null, array(
            'notnull' => true, 'primary' => false
            )
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
