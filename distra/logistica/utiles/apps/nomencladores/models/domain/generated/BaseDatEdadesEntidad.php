<?php

abstract class BaseDatEdadesEntidad extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.dat_edadesentidad');
        $this->hasColumn(
            'idedadesentidad', 'numeric', null, array(
                'notnull'  => true,
                'primary'  => true,
                'sequence' => 'mod_logtaller.sec_datedadesentidad'
            )
        );
        $this->hasColumn(
            'idnomedades', 'numeric', null, array(
                'notnull' => true,
                'primary' => false
            )
        );
        $this->hasColumn(
            'idestructuracomun', 'numeric', null, array(
                'notnull' => false,
                'primary' => false
            )
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}



