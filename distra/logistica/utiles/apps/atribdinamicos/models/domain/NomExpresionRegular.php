<?php

class NomExpresionRegular extends BaseNomExpresionRegular
{
    public function setUp()
    {
        $this->hasMany(
            'NomExpresionRegular', array('local' => 'idexpresionregular', 'foreign' => 'idexpresionregular')
        );
    }

}
