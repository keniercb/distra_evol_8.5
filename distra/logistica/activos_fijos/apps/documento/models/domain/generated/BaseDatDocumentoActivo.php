<?php

/**
 *
 */
class BaseDatDocumentoActivo extends Doctrine_Record
{

    /**
     *
     */
    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.dat_documentoactivo');
        $this->hasColumn('iddocumentoactivo', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idcentrocosto', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('tipo', 'numeric', null, array('notnull' => false, 'primary' => false));

        $this->hasColumn('idareadestino', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idresponsabledestino', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcentrocostodestino', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('masivo', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
    }

}
