<?php

abstract class BaseDatEmailContent extends BaseRecord
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_emailcontent');
        $this->hasColumn(
            'asunto', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idcontenido', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'texto', 'character varying', null,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}