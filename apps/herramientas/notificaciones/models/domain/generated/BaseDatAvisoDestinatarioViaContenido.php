<?php

abstract class BaseDatAvisoDestinatarioViaContenido extends BaseRecord
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_avisodestinatarioviacontenido');
        $this->hasColumn(
            'idaviso', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idcontenido', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'iddestinatario', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}