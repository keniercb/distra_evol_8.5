<?php

abstract class BaseDatJabberContent extends BaseRecord
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_jabbercontent');
        $this->hasColumn(
            'idcontenido', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'texto', 'character varying', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}