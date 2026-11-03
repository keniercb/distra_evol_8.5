<?php

abstract class BaseDatDocumentodepreciacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_documentodepreciacion');
        $this->hasColumn('iddocumento', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('fecha', 'date', null, array('notnull' => false, 'primary' => false));
    }

    /**
     *
     */
    public function setUp()
    {
        parent:: setUp();
    }

}
