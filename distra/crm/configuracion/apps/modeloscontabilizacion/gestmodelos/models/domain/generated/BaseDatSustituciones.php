<?php

abstract class BaseDatSustituciones extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.dat_sustitucion');
        $this->hasColumn('idsustitucion', 'numeric', 19,array('notnull'  => true, 'primary' => true,
            'sequence' => 'mod_datosmaestros.sec_datsustitucion'));
        $this->hasColumn('idasiento', 'numeric', 19, array('notnull' => true));
        $this->hasColumn('tipoorigen', 'numeric', 1, array('notnull' => false));
        $this->hasColumn('idnivelsustitucion', 'numeric', 19, array('notnull' => true));
        $this->hasColumn('valor', 'numeric', 19, array('notnull' => false));
        $this->hasColumn('referencia', 'varchar', 150, array('notnull' => false));
    }

    public function setUp()
    {
        parent::setUp();
    }

}
