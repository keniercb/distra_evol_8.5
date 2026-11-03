<?php

class NomTasacambio extends BaseNomTasacambio
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatTasacambioEntidad', array('local'   => 'idtasacambio','foreign' => 'idtasacambio'));
    }
}
