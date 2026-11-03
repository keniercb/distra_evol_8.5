<?php

/**
 *
 */
class DatDocAltaCompra extends BaseDatDocAltaCompra
{

    /**
     *
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatDocumentoActivo', array('local' => 'iddocaltacompra', 'foreign' => 'iddocumentoactivo'));
    }

}
