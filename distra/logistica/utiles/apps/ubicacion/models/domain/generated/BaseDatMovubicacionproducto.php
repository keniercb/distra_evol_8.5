<?php

abstract class BaseDatMovubicacionproducto extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('dat_movubicacionproducto');
        $this->hasColumn('idmovimiento', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmovubicacion', 'numeric', null, array('notnull' => true, 'primary' => true));
    }

    public function Setup()
    {
        parent::setUp();
    }
}

