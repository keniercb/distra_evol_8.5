<?php

/**
 *
 */
class BaseDatRegAutorizo extends Doctrine_Record
{

    /**
     *
     */
    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.dat_regautorizo');
        $this->hasColumn('idregautorizo', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('iddocumentocliente', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idregnumerico', 'numeric', null, array('notnull' => true, 'primary' => false)); 
        //$this->hasColumn('idorigen', 'numeric', null, array('notnull' => true, 'primary' => false)); 
    }

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
    }

}
