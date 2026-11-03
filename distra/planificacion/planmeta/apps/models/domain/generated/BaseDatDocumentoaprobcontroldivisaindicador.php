<?php

abstract class BaseDatDocumentoaprobcontroldivisaindicador
    extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_documentoaprobcontroldivisaindicador');
        $this->hasColumn(
            'idcontroldivisaindicador', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'iddocumentoaprobacion', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}


