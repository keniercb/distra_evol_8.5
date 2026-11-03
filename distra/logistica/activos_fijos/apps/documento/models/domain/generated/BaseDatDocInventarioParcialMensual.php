<?php

/**
 *
 */
class BaseDatDocInventarioParcialMensual
{

    /**
     *
     */
    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.dat_inventarioparcialmensual');
        $this->hasColumn('iddocumentoactivo', 'numeric', null, array('notnull' => false, 'primary' => true));
        $this->hasColumn('idnaturaleza', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idindicador', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
    }

}
