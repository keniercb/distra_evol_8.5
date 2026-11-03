<?php

abstract class BaseDatClientecodigo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.dat_clientecodigo');
        $this->hasColumn(
            'idclientecodigo', 'numeric', null,
                array('notnull' => true, 'primary' => true, 'sequence' => 'mod_datosmaestros.sec_datclientecodigo')
        );
        $this->hasColumn(
            'idcodigoindicador', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idclientesproveedores', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }
}        
