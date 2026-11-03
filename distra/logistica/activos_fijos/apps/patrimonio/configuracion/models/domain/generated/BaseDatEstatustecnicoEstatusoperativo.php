<?php

abstract class BaseDatEstatustecnicoEstatusoperativo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.dat_estatustecnicoestatusoperativo');
        $this->hasColumn(
            'idestatustecnico', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false,
            'primary' => true)
        );
        $this->hasColumn(
            'idestatusoperativo', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false,
            'primary' => true)
        );
        $this->hasColumn(
            'pordefecto', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false,
            'notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'disponible', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false,
            'notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'afectacdt', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false,
            'notnull' => false, 'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }

}
