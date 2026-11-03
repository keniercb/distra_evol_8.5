<?php

class DatCuentafacturacliente extends BaseDatCuentafacturacliente
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatDocfactura', array('local' => 'idfactura', 'foreign' => 'idfactura')
        );
    }
}
