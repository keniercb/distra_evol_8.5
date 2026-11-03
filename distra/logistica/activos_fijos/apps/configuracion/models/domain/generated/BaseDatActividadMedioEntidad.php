<?php

abstract class BaseDatActividadMedioEntidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.dat_actividadentidad');
        $this->hasColumn(
            'idactividadentidad', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false,
            'primary' => true, 'sequence' => 'mod_logactivofijotangible.sec_datactividadentidad')
        );
        $this->hasColumn(
            'idactividad', 'numeric', null,
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
