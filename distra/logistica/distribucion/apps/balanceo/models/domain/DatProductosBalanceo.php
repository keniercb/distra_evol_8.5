<?php

class DatProductosBalanceo extends BaseDatProductosBalanceo
{
    public function setUp()
    {
        $this->hasOne(
            'DatProductosBalanceo', array(
                'foreign' => 'idproductosbalanceo', 'local' => 'idproductosbalanceopadre'
            )
        );
        $this->hasOne(
            'DatDocBalanceo', array(
                'foreign' => 'iddocbalanceo', 'local' => 'iddocbalanceo'
            )
        );
        $this->hasOne(
            'DatPedido', array(
                'foreign' => 'iddocumento', 'local' => 'iddocpedido'
            )
        );
        $this->hasOne(
            'Nomclasificacionabc', array(
                'foreign' => 'idclasificacionabc', 'local' => 'idclasificacionabc'
            )
        );
        $this->hasOne(
            'NomIndicador', array(
                'foreign' => 'idindicador', 'local' => 'idindicador'
            )
        );
        parent::setUp();
    }
}