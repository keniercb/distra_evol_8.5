<?php

/**
 *
 */
class BaseDatDocumentoOrigen extends Doctrine_Record
{

    /**
     *
     */
    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.dat_docorigen');
        $this->hasColumn('iddocorigen', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('iddocinventario', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fecha', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('numero', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('iddocumentoinv', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('clave', 'character varying', null, array('notnull' => true, 'primary' => false));
    }

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
    }

}
