<?php

abstract class BaseDatProductomunicComprometido extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_loginventario.dat_productomuniccomprometido');
        $this->hasColumn(
            'idproductomuniccomprometido', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_loginventario.sec_datproductomuniccomprometido')
        );
        $this->hasColumn('idproductomunic', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('iddocumento', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('cantidad', 'numeric', 0, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estado', 'numeric', 1, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
