<?php

abstract class BaseDatLocalEntidad extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logpatrimonio.dat_localentidad');
        $this->hasColumn(
            'idlocalentidad', 'numeric', null,
            array('type'     => 'numeric', 'fixed' => false, 'unsigned' => false, 'primary' => true,
                  'sequence' => 'mod_logpatrimonio.sec_datlocalentidad')
        );
        $this->hasColumn(
            'idlocal', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idestructuracomun', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false, 'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }
}