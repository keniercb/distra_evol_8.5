<?php

class DatMarcanaturaleza extends BaseNomMarcanaturaleza
{
    public function setUp()
    {
        parent::setUp();

        $this->hasOne('NomMarca', array('local' => 'idmarca', 'foreign' => 'idmarca'));
        $this->hasOne('NomNaturaleza', array('local' => 'idnaturaleza', 'foreign' => 'idnaturaleza'));
    }
}