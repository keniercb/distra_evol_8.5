<?php

abstract class BaseDatIndicadorcliente extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.dat_indicadorcliente');
        $this->hasColumn(
            'idindicadorcliente', 'numeric', null,
                array('notnull' => true, 'primary' => true, 'sequence' => 'mod_datosmaestros.sec_indicadorcliente')
        );
        $this->hasColumn(
            'idindicador', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idcliente', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idcontrato', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'estado', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn('fechainicio', 'date', null, 
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'ano', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'codigoaux', 'character varying', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn('fechafin', 'date', null, 
            array('notnull' => false, 'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }
}        
