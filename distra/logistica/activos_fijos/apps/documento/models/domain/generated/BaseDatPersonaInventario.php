<?php

/**
 *
 */
class BaseDatPersonaInventario extends Doctrine_Record
{

    /**
     *
     */
    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.dat_personainventario');
        $this->hasColumn('iddocumento', 'numeric', null, array('notnull' => false, 'primary' => true));
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => false, 'primary' => true));
    }

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
    }

}
