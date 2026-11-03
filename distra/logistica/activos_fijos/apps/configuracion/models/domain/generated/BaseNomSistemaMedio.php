<?php

abstract class BaseNomSistemaMedio extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.nom_sistemamedio');
        $this->hasColumn(
            'idnomsistemamedio', 'numeric', null,
            array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_logactivofijotangible.sec_nomsistemamedio')
        );
        $this->hasColumn(
            'denominacion', 'character varing', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'activo', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }

}
