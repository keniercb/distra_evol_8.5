<?php

class DatUbicacionComprometida extends BaseDatUbicacionComprometida
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatEstructuraubicacion', array('local' => 'idubicacion', 'foreign' => 'idestructuraubicacion'));
        $this->hasOne('DatDocumento', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
        $this->hasOne('DatProductoLogistica', array('local' => 'idproducto', 'foreign' => 'idproducto'));
        $this->hasOne('DatLote', array('local' => 'idlote', 'foreign' => 'idlote'));
        $this->hasOne('DatLoteComprometido', array('local' => 'idubicacion', 'foreign' => 'idubicacion'));
        $this->hasOne('DatProductomunic', array('local' => 'idproducto', 'foreign' => 'idproducto'));
    }

}
