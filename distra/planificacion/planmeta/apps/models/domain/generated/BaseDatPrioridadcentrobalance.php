<?php

abstract class BaseDatPrioridadcentrobalance extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_prioridadcentrobalance');
        $this->hasColumn(
            'idcentrobalance', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idespecialidad', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'prioridad', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 0)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}


