<?php

class DatMarcamodelo extends BaseNomMarcamodelo
{
    public function setUp()
    {
        parent::setUp();

        $this->hasOne('NomMarca', array('local' => 'idmarca', 'foreign' => 'idmarca'));
        $this->hasOne('NomModelo', array('local' => 'idmodelo', 'foreign' => 'idmodelo'));
        $this->hasOne('NomNaturaleza', array('local' => 'idnaturaleza', 'foreign' => 'idnaturaleza'));
    }
}