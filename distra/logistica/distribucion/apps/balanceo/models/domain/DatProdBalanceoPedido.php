<?php

class DatProdBalanceoPedido extends BaseDatProdBalanceoPedido
{
    public function setUp()
    {
        $this->hasMany(
            'DatProductosBalanceo', array(
                'foreign' => 'idproductosbalanceo', 'local' => 'idproductosbalanceo'
            )
        );
        
        parent::setUp();
    }
}