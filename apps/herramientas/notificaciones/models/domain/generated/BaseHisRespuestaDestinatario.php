<?php

abstract class BaseHisRespuestaDestinatario extends BaseRecord
{

    public function setTableDefinition()
    {
        $this->setTableName('his_respuestadestinatario');
        $this->hasColumn(
            'idrespuestadestinatario', 'numeric', 19,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'sec_respuestadestinatario')
        );
        $this->hasColumn(
            'idrespuestatarea', 'numeric', 19,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'destinatario', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'observacion', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fecha', 'timestamp', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'exito', 'numeric', 1, array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}