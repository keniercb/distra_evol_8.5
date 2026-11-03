<?php

/**
 *
 */
class BaseDatDocBajaVenta extends Doctrine_Record
{

    /**
     *
     */
    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.dat_docbajaventa');
        $this->hasColumn('iddocbajaventa', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('iddestinofinal', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idclientesproveedoresbajaventa', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('entidad', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('nrocontrato', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('informetecnico', 'character varying', null, array('notnull' => true, 'primary' => false));
    }

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
    }

}
