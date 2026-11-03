<?php

/**
 *
 */
class DatDocBajaDesarme extends BaseDatDocBajaDesarme
{

    /**
     *
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatDocumentoActivo', array('local' => 'iddocbajadesarme', 'foreign' => 'iddocumentoactivo'));
    }

}
