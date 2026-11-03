<?php

/**
 *
 */
class BaseDatModulotraza extends Doctrine_Record
{

    /**
     *
     */
    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.dat_modulotraza');
        $this->hasColumn(
            'idmodulotraza', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'sec_datmodulotraza')
        );
        $this->hasColumn('idregistronumerico', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmovregnumerico', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idusuario', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fecha', 'date', null, array('notnull' => false, 'primary' => false));
    }

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
    }

}
