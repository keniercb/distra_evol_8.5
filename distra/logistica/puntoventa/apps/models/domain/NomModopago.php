<?php

class NomModopago extends BaseNomModoPago
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatModopagoEntidad', array('local' => 'idmodopago', 'foreign' => 'idmodopago'));
    }
}
