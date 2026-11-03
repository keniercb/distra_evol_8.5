<?php

class DatIndcontrato extends BaseDatIndcontrato
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatIndicadorcontcategoria',
            array('local' => 'idindicadorcontrato', 'foreign' => 'idindicadorcontrato')
        );
    }
}
