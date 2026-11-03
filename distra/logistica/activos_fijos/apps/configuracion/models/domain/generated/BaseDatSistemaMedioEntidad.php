<?php

abstract class BaseDatSistemaMedioEntidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.dat_sistemamedioentidad');
        $this->hasColumn(
            'iddatsistemamedioentidad', 'numeric', null,
            array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_logactivofijotangible.sec_datsistemamedioentidad')
        );
        $this->hasColumn(
            'idnomsistemamedio', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idnomsistemamedio', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idestructuracomun', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }

}
