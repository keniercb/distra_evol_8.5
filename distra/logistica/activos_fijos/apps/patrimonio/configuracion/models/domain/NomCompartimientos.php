<?php

class NomCompartimientos extends BaseNomCompartimiento
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatCompartimientosEntidad', array('local' => 'idcompartimiento', 'foreign' => 'idcompartimiento'));

    }
}