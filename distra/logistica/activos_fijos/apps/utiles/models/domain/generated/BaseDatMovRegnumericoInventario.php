<?php

/**
 *
 */
class BaseDatMovRegnumericoInventario extends Doctrine_Record
{

    /**
     *
     */
    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.dat_movregnumericoinventario');
        $this->hasColumn('idmovregnumerico', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('color', 'character varying', 20, array('notnull' => false, 'primary' => false));
    }

    public function setUp()
    {
        parent::setUp();
    }

}
