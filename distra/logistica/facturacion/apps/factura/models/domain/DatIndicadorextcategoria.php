<?php

class DatIndicadorextcategoria extends BaseDatIndicadorextcategoria
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
