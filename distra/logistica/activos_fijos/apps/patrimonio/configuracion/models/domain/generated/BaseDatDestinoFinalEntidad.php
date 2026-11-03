<?php

abstract class BaseDatDestinoFinalEntidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.dat_destinofinalentidad');
        $this->hasColumn(
            'iddestinofinalentidad', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false,
            'primary' => true, 'sequence' => 'mod_logactivofijotangible.sec_datdestinofinalentidad')
        );
        $this->hasColumn(
            'iddestinofinal', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false,
            'primary' => false)
        );
        $this->hasColumn(
            'idestructuracomun', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false,
            'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }

}
