<?php

class DatUbicacionlote extends BaseDatUbicacionlote
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatExistenciaubicacion', array('local'   => 'idexistenciaubicacion',
                                            'foreign' => 'idexistenciaubicacion')
        );
    }

}


