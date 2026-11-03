<?php

abstract class BaseDatSeriedocEntidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.dat_seriedocentidad');
        $this->hasColumn(
            'idseriedocentidad', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'sec_seriedocentidad')
        );
        $this->hasColumn(
            'idestructuracomun', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idseriedocumento', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase 
