<?php

/**
 *
 */
class BaseDatDocTransfEntreEntidades extends Doctrine_Record
{

    /**
     *
     */
    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.dat_doctransfentidades');
        $this->hasColumn('iddoctranfentidades', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('identidaddestino', 'numeric', null, array('notnull' => true, 'primary' => false));        
    }

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
    }

}
