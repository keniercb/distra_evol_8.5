<?php

abstract class BaseDatReenvase extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfarmacia.dat_reenvase');

        $this->hasColumn(
            'idreenvase', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'fecha',  'date', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idarea',  'numeric', 19,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'cantdif',  'numeric', 25,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'importecosto',  'numeric', 25,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'importeventa',  'numeric', 25,
            array('notnull' => false, 'primary' => false)
        );

    }

    public function Setup()
    {
        parent::setUp();
    }

}