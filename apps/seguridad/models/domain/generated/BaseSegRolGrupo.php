<?php

abstract class BaseSegRolGrupo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('seg_rolgrupo');
        $this->hasColumn(
            'idgrupo',
            'numeric',
            null, 
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idrol',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}