<?php

class BaseNomServicioimportar extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('nom_servicioimportar');
        $this->hasColumn(
            'idservicio', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'denominacion', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'cadena', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}


