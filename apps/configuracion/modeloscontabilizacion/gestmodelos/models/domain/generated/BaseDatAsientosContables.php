<?php

abstract class BaseDatAsientosContables extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.dat_asientocontable');
        $this->hasColumn(
            'idasiento', 'numeric', 19,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_datosmaestros.sec_datasientoscontables')
        );
        $this->hasColumn('idmodelo', 'numeric', 19, array('notnull' => true));
        $this->hasColumn('tipocuenta', 'numeric', 1, array('notnull' => true));
        $this->hasColumn('cuenta', 'numeric', 19, array('notnull' => false));
        $this->hasColumn(
            'creditodebito', 'varchar', 1, array('notnull' => true)
        );
        $this->hasColumn(
            'idvalorcontable', 'numeric', 19, array('notnull' => false)
        );
        $this->hasColumn('porciento', 'numeric', 5, array('notnull' => true));
    }

    public function setUp()
    {
        parent::setUp();
    }

}
