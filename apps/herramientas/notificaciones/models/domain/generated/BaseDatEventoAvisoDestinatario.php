<?php

abstract class BaseDatEventoAvisoDestinatario extends BaseRecord
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_eventoavisodestinatario');
        $this->hasColumn(
            'id', 'serial', null, array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idevento', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idaviso', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'iddestinatario', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'originadopor', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fecha', 'timestamp without time zone', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'estado', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}