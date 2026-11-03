<?php

class DatProdBalanceoDist extends BaseDatProductosBalanceo
{
    public function setUp()
    {
        $this->hasOne(
            'DatProductosBalanceo', array(
                'foreign' => 'idproductosbalanceo', 'local' => 'idproductosbalanceo'
            )
        );
        $this->hasOne(
            'DatProductoLogistica', array(
                'foreign' => 'idproducto', 'local' => 'idproducto'
            )
        );
        parent::setUp();
    }
}