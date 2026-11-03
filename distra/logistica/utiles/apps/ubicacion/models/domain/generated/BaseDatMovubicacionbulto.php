<?php

abstract class BaseDatMovubicacionbulto extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('dat_movubicacionbulto');
        $this->hasColumn('idmovubicacion', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idmovbulto', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}

