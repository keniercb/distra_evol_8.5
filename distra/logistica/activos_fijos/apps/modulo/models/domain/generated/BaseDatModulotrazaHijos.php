<?php

/**
 *
 */
class BaseDatModulotrazaHijos extends Doctrine_Record
{

    /**
     *
     */
    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.dat_modulotrazahijos');
        $this->hasColumn(
            'idmodulotrazahijo', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'sec_modulotrazahijo')
        );
        $this->hasColumn('idmodulotraza', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmovregnumerico', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idregnumerico', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
    }

}
