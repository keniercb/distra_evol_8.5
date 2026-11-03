<?php

abstract class BaseCfgMedioSistemaMedio extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.conf_mediosistemamedio');
        $this->hasColumn(
            'idconfmediosistemamedio', 'numeric', null,
            array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_logactivofijotangible.sec_confmediosistemamedio')
        );
        $this->hasColumn(
            'idnomsistemamedio', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idindicador', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }

}
