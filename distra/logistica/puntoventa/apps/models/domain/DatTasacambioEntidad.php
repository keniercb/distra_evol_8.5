<?php

class DatTasacambioEntidad extends BaseDatTasacambioentidad
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('NomTasacambio',array('local'   => 'idtasacambio','foreign' => 'idtasacambio'));
    }
}