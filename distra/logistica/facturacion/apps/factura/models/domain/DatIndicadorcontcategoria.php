<?php

class DatIndicadorcontcategoria extends BaseDatIndicadorcontcategoria
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatCuentadesgloceprecio',
            array('local' => 'idcuentadesgloseprecio', 'foreign' => 'idcuentadesgloseprecio')
        );
    }
}
