<?php

/**
 *
 */
class BaseDatDocInventarioParcial extends Doctrine_Record
{

    /**
     *
     */
    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.dat_docinventarioparcial');
        $this->hasColumn('iddocinventarioparcial', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('areas', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('mensual', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
    }

}
