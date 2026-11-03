<?php

abstract class BaseDatDocumentocl extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logistica.dat_documentocl');
        $this->hasColumn(
            'iddocumentocl', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logistica.sec_datdocumentocl')
        );
        $this->hasColumn(
            'iddocumento', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idindicador', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idproducto', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}

