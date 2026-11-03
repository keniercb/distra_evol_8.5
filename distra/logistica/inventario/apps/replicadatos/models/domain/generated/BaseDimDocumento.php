<?php

abstract class BaseDimDocumento extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_loganalisis.dim_documento');

        $this->hasColumn('iddocumento', 'numeric', null, array('notnull' => false, 'primary' => true));
        $this->hasColumn('denominacion', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('codigo', 'character varying', 255, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
