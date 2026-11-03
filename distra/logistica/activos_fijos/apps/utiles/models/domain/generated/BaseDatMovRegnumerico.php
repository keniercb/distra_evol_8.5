<?php

/**
 *    Jorge Luis Cuellar Mondeja 28/10/2011
 */
abstract class BaseDatMovRegnumerico extends Doctrine_Record
{

    /**
     *
     */
    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.dat_movregnumerico');
        $this->hasColumn(
            'idmovregnumerico', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                'sequence' => 'mod_logactivofijotangible.sec_datmovregnumerico')
        );
        $this->hasColumn('idregnumerico', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idmovimiento', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
    }

}
