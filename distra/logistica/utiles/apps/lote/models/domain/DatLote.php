<?php

class DatLote extends BaseDatLote
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatMovlote', array('local' => 'idlote', 'foreign' => 'idlote'));
        $this->hasMany('DatLoteComprometido', array('local' => 'idlote', 'foreign' => 'idlote'));
        $this->hasMany('DatUbicacionComprometida', array('local' => 'idlote', 'foreign' => 'idlote'));
        $this->hasOne('DatProductoLogistica', array('local' => 'idproducto', 'foreign' => 'idproducto'));
        $this->hasOne('DatArealote', array('local' => 'idlote', 'foreign' => 'idlote'));
        $this->hasOne('DatUbicacionlote', array('local' => 'idlote', 'foreign' => 'idlote'));
    }

}
