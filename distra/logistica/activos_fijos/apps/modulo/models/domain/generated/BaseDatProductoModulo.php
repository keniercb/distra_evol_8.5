<?php

abstract class BaseDatProductoModulo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.dat_productomodulo');
        $this->hasColumn('idproducto', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('denominacion', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('estado', 'numeric', 1, array('notnull' => true, 'primary' => false));
    }

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
    }

}
