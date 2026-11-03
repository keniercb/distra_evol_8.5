<?php

abstract class BaseNomEstatusoperativo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.nom_estatusoperativo');
        $this->hasColumn(
            'idestatusoperativo', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false,
            'primary' => true, 'sequence' => 'mod_logactivofijotangible.sec_nomestatusoperativo')
        );
        $this->hasColumn(
            'denominacion', 'string', null,
            array('type' => 'string', 'fixed' => false, 'unsigned' => false,
            'notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'estado', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false,
            'notnull' => false, 'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }

}
