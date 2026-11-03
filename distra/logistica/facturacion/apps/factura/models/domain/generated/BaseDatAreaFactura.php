<?php

abstract class BaseDatAreaFactura extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.dat_areafactura');
        $this->hasColumn(
            'idareafactura', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logfacturacion.sec_datareafactura')
        );
        $this->hasColumn(
            'idfactura', 'numeric', 19, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idarea', 'numeric', 19, array('notnull' => true, 'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }
}
