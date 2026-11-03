<?php

abstract class BaseDatEventoAviso extends BaseRecord
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_eventoaviso');
        $this->hasColumn(
            'idaviso', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idevento', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}