<?php

abstract class BaseDatDocumentoImagen extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logistica.dat_documentoimagen');
        $this->hasColumn(
            'iddocumento', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idimagen', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'tipo', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}

