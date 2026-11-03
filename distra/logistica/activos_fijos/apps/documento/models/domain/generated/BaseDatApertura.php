<?php

/**
 *
 */
class BaseDatApertura extends Doctrine_Record
{

    /**
     *
     */
    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.dat_apertura');
        $this->hasColumn(
            'iddocapertura', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logactivofijotangible.sec_datapertura')
        );
        $this->hasColumn('destino', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('estadoemisor', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('estadoreceptor', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('cantidadmedios', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('nroapertura', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('estructuraorigen', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => true, 'primary' => false));
    }

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
    }

}
