<?php

abstract class BaseDatDestinatario extends BaseRecord
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_destinatario');
        $this->hasColumn(
            'idtipodest', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'iddestinatario', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'sec_destinatario')
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}