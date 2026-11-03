<?php

/**
 *
 */
class DatDocBajaVenta extends BaseDatDocBajaVenta
{

    /**
     *
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatDocumentoActivo', array('local' => 'iddocbajaventa', 'foreign' => 'iddocumentoactivo'));
    }

}
