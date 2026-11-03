<?php

abstract class BaseConfCalendario extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_objetivos.conf_calendario');
        $this->hasColumn(
            'idcalendario', 'numeric', null,
            array('notnull' => false, 'primary' => true,
                  'sequence' => 'sec_calendario')
        );
        $this->hasColumn(
            'denominacion', 'character varying', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idestructura', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idtipodia', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }


}

