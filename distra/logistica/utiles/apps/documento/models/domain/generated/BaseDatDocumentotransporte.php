<?php

abstract class BaseDatDocumentotransporte extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_documentotransporte');
        $this->hasColumn(
            'iddocumentotransporte', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'sec_datdocumentotransporte')
        );
        $this->hasColumn('embarque', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('iddocumento', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('matricula', 'character varying', 10, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cartaporte', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('manifiesto', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nombreconductor', 'character varying', 100, array('notnull' => false, 'primary' => false));
        $this->hasColumn('ciconductor', 'character varying', 11, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idorganizacion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('partida', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('casilla', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function setUp()
    {
        parent::setUp();
    }

}
