<?php

abstract class BaseNomTipoDestinatario extends BaseRecord
{

    public function setTableDefinition()
    {
        $this->setTableName('nom_tipodestinatario');
        $this->hasColumn(
            'denominacion', 'character varying', 30,
            array('notnull' => true, 'primary' => false,
                  'sequence' => 'sec_tipodestinatario',)
        );
        $this->hasColumn(
            'idtipodest', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}