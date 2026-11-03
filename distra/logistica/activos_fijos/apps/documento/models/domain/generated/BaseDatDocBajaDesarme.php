<?php

/**
 *
 */
class BaseDatDocBajaDesarme extends Doctrine_Record
{

    /**
     *
     */
    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.dat_docbajadesarme');
        $this->hasColumn('iddocbajadesarme', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('informetecnico', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('iddestinofinal', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('entidad', 'character varying', null, array('notnull' => true, 'primary' => false));
    }

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
    }

}
