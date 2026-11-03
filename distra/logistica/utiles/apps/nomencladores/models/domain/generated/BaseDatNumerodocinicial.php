<?php

abstract class BaseDatNumerodocinicial extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.dat_numerodocinicial');
        $this->hasColumn(
            'idnumerodocinicial', 'numeric', null,
            array(
            'notnull' => true,
            'primary' => true,
            'sequence' => 'mod_logfacturacion.sec_numerodocinicial'
            )
        );
        $this->hasColumn(
            'idseriedocentidad', 'numeric', null,
            array(
            'notnull' => true,
            'primary' => false
            )
        );
        $this->hasColumn(
            'nrodocumentoinicial', 'numeric', null,
            array(
            'notnull' => true,
            'primary' => false
            )
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase 
