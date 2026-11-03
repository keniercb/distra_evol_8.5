<?php

class BaseDatDocTransfereciaEntreAreas extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.dat_transfentreareas');
        $this->hasColumn('idtranfentreareas', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('iddocorigen', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('iddocdestino', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function setUp()
    {
        parent::setUp();
    }
}