<?php

/**
 *
 */
class DatDocAlquiler extends BaseDatDocAlquiler
{

    /**
     *
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatDocumentoActivo', array('local' => 'iddocalquiler', 'foreign' => 'iddocumentoactivo'));
    }

}
