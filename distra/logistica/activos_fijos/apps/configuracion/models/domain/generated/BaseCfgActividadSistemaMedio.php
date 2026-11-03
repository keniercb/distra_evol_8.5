<?php

abstract class BaseCfgActividadSistemaMedio extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.conf_actividadsistemamedio');
        $this->hasColumn(
            'idconfactividadsistemamedio', 'numeric', null,
            array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_logactivofijotangible.sec_confactividadsistemamedio')
        );
        $this->hasColumn(
            'idactividad', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idnomsistemamedio', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }

}
