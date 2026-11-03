<?php

class DatUbicacionlote extends BaseDatUbicacionlote
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatLote', array('local' => 'idlote', 'foreign' => 'idlote'));
        $this->hasOne('DatArealote', array('local' => 'idlote', 'foreign' => 'idlote'));
        $this->hasOne('DatEstructuraubicacion', array('local' => 'idubicacion', 'foreign' => 'idestructuraubicacion'));
    }

}