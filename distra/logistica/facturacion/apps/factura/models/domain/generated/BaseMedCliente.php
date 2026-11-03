<?php

abstract class BaseMedCliente extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.dat_medidorcliente');
        $this->hasColumn(
            'idmedicioncliente', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logfacturacion.sec_datmedicioncliente')
        );
        $this->hasColumn('idcontrato', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcliente', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechamedicion', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('medicion', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}
