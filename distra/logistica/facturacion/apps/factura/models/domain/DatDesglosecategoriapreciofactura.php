<?php

class DatDesglosecategoriapreciofactura extends BaseDatDesglosecategoriapreciofactura
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatCategoriaPrecioFactura', array('local' => 'idcategoriafactura', 'foreign' => 'idcategoriafactura')
        );
    }
}
