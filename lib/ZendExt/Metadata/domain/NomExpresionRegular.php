<?php

class NomExpresionRegular extends BaseNomExpresionRegular
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatComponente', array('local'    => 'idexpresionregular', 'foreign' => 'idcomponente',
                                   'refClass' => 'DatComponenteNomExpresionRegular')
        );
    }

}