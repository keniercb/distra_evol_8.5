<?php

class DatCantidadesComprometidas extends BaseDatCantidadesComprometidas
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatDocumento', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
        $this->hasOne('DatProductoLogistica', array('local' => 'idproducto', 'foreign' => 'idproducto'));
        $this->hasOne('DatDocumentoCliente', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
        $this->hasOne('DatProdorden', array('local' => 'iddocumento', 'foreign' => 'idorden'));
    }

}
