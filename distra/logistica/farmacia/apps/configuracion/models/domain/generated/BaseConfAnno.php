<?php

abstract class BaseConfAnno extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfarmacia.conf_anno');

        $this->hasColumn(
            'idanno', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => "mod_logfarmacia.sec_confanno")
        );
        $this->hasColumn(
            'denominacion', 'character varying', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'estado', 'numeric', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'activo', 'numeric', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechainicio', 'character varying', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechafin', 'character varying', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'identidad', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
