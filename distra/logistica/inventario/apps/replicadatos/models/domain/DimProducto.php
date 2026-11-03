<?php

class DimProducto extends BaseDimProducto
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('CubExistencia', array('local' => 'idproducto', 'foreign' => 'idproducto'));
        $this->hasOne('CubMovimiento', array('local' => 'idproducto', 'foreign' => 'idproducto'));
    }

}
