<?php

abstract class BaseDatAdjunto extends BaseRecord
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_adjunto');
        $this->hasColumn(
            'adjunto', 'bytea', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fkemail', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'pkadjunto', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}