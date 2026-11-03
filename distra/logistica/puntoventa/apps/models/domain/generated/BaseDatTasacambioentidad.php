<?php

abstract class BaseDatTasacambioentidad extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logpuntoventa.dat_tasacambioentidad');
        $this->hasColumn(
            'idtasacambioentidad', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idtasacambio', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idestructuracomun', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}