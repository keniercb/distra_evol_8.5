<?php

abstract class BaseDatEjerciciotarea extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_planifproyecto.dat_ejerciciotarea');
        $this->hasColumn(
            'idejercicio', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idtarea', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idejerciciotarea', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );

    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase


