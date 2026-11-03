<?php

abstract class BaseConfModulos extends Doctrine_Record
{

    public function setTableDefinition()
    {

        $this->setTableName('mod_rrhhmaestro.dat_modulo');

        $this->hasColumn('idmodulo', 'numeric', 3, array(
            'type' => 'numeric',
            'length' => 3,
            'notnull' => true,
            'primary' => true,
            'sequence' => 'mod_rrhhmaestro.sec_modulo'
        ));

        $this->hasColumn('identificador', 'character varying', 50, array(
            'type' => 'character varying',
            'length' => 50,
            'notnull' => true,
            'primary' => false,
        ));

        $this->hasColumn('denominacion', 'character varying', 50, array(
            'type' => 'character varying',
            'length' => 50,
            'notnull' => true,
            'primary' => false,
        ));

        $this->hasColumn('cobroypago', 'numeric', 1, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));

        $this->hasColumn('apertura', 'numeric', 1, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
        $this->hasColumn('parrafofiscal', 'numeric', 1, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));

        $this->hasColumn('fijaretencionesporpagar', 'numeric', 1, array(
            'type' => 'numeric',
            'length' => 1,
            'notnull' => false,
            'primary' => false
        ));
    }

    public function setUp()
    {

        parent::setUp();

    }
}
