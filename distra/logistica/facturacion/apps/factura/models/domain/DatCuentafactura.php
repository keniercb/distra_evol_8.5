<?php

class DatCuentafactura extends BaseDatCuentafactura
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatDocfactura', array('local' => 'idfactura', 'foreign' => 'idfactura')
        );
    }
}
