<?php

/**
 *
 */
class DatDocArrendamiento extends BaseDatDocArrendamiento
{

    /**
     *
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatDocumentoActivo', array('local' => 'iddocarrendamiento', 'foreign' => 'iddocumentoactivo'));
    }

}
