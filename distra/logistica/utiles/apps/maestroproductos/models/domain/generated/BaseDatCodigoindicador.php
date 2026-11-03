<?php

abstract class BaseDatCodigoindicador extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.dat_codigoindicador');
        $this->hasColumn(
            'idcodigoindicador', 'numeric', null,
                array('notnull' => true, 'primary' => true, 'sequence' => 'mod_datosmaestros.sec_datcodigoindicador')
        );
        $this->hasColumn(
            'idindicador', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'nombre', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'codigo', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }
}        
