<?php

class DatCampoTexto extends BaseDatCampoTexto
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomExpresionRegular', array('local' => 'idexpresionregular', 'foreign' => 'idexpresionregular')
        );
    }

}