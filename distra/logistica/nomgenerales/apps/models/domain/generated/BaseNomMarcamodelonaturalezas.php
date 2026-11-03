<?php

abstract class BaseNomMarcamodelonaturalezas extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.dat_marcamodelonaturalezas');
        $this->hasColumn(
            'idmarcamodelo', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false, 'primary' => true)
        );
        $this->hasColumn(
            'idnaturaleza', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false, 'primary' => true)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }
}