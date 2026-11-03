<?php

class DatMovcambioccontable extends BaseDatMovcambioccontable
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatDocumento', array('local' => 'iddocumento', 'foreign' => 'idproducto'));
        $this->hasOne('DatProductoLogistica', array('local' => 'idproducto', 'foreign' => 'idproducto'));
        $this->hasOne(
            'NomClasificacioncontablelog',
            array('local' => 'idclasificacioncontable', 'foreign' => 'idclasificacioncontable')
        );
    }

}