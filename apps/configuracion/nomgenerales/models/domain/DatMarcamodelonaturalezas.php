<?php

class DatMarcamodelonaturalezas extends BaseNomMarcamodelonaturalezas
{
    public function setUp()
    {
        parent::setUp();

        $this->hasMany('NomMarcamodelo', array('local' => 'idmarcamodelo', 'foreign' => 'idmarcamodelo'));
        $this->hasMany('NomNaturaleza', array('local' => 'idnaturaleza', 'foreign' => 'idnaturaleza'));
    }
}