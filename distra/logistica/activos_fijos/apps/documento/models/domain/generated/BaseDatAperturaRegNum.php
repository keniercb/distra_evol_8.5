<?php

/**
 *
 */
class BaseDatAperturaRegNum extends Doctrine_Record
{

    /**
     *
     */
    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.dat_aperturaregnum');
        $this->hasColumn(
            'idaperturaregnum', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logactivofijotangible.sec_aperturaregnum')
        );
        $this->hasColumn('iddocapertura', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idregnumerico', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idarearesp', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
    }

}
