<?php

abstract class BaseDatGrupoDestinatario extends BaseRecord
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_grupodestinatario');
        $this->hasColumn(
            'iddestinatario', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idgrupo', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}