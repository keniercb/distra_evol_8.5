<?php

class DatArealote extends BaseDatArealote
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatLote', array('local' => 'idlote', 'foreign' => 'idlote'));
        $this->hasOne('DatArea', array('local' => 'idarea', 'foreign' => 'idarea'));
        $this->hasOne('DatUbicacionlote', array('local' => 'idlote', 'foreign' => 'idlote'));
        $this->hasOne('DatEstructuraubicacion', array('local' => 'idarea', 'foreign' => 'idarea'));
    }

}
