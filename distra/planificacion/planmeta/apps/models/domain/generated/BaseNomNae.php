<?php

abstract class BaseNomNae extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('nom_nae');
        $this->hasColumn(
            'codigo', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'denominacion', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idnae', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}


