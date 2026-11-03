<?php

class NomTipocaja extends BaseNomTipocaja
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatTipocajaEntidad', array('local' => 'idtipocaja', 'foreign' => 'idtipocaja'));
        if (class_exists('DatCaja')) {
            $this->hasMany('DatCaja', array('local' => 'idtipocaja', 'foreign' => 'idtipocaja'));
        }
    }
}
