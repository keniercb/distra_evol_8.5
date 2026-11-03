<?php

abstract class BaseDatCasaClasificadoraEntidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.dat_casaclasifcentidad');
        $this->hasColumn(
            'idcasaclasifcentidad', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false,
            'primary' => true, 'sequence' => 'mod_logactivofijotangible.sec_datcasaclasifcentidad')
        );
        $this->hasColumn(
            'idcasaclasifc', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false,
            'primary' => false)
        );
        $this->hasColumn(
            'idestructuracomun', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false,
            'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }

}
