<?php

class DatProdordenlote extends BaseDatProdordenlote
{
    public function setUp()
    {
        $this->hasMany('DatProdorden', array('local' => 'idprodordenlote', 'foreign' => 'idprodorden'));
        $this->hasOne('DatProductoLogistica', array('local' => 'idproducto', 'foreign' => 'idproducto'));
        $this->hasOne('DatLote', array('local' => 'idlote', 'foreign' => 'idlote'));
        parent::setUp();
    }
}