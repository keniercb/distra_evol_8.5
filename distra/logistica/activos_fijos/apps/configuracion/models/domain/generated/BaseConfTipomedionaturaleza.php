<?php

abstract class BaseConfTipomedionaturaleza extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('conf_tipomedionaturaleza');
        $this->hasColumn(
            'tipo', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'denominacion', 'character varying', 255, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idnaturaleza', 'numeric', null, array('notnull' => true, 'primary' => true)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }

}
