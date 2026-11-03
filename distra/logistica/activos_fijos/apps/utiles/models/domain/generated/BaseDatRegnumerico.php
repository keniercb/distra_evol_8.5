<?php

/**
 *    Jorge Luis Cuellar Mondeja 28/10/2011
 */
abstract class BaseDatRegNumerico extends Doctrine_Record
{

    /**
     *
     */
    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.dat_registronumerico');
        $this->hasColumn(
            'idregnumerico', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_logactivofijotangible.sec_datregistronumerico'
            )
        );
        $this->hasColumn('idproducto', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('nroserie', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('enproceso', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function setUp()
    {
        parent::setUp();
    }

}
