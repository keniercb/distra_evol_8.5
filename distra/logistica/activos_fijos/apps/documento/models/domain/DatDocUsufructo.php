<?php

/**
 *
 */
class DatDocUsufructo extends BaseDatDocUsufructo
{

    /**
     *
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatDocumentoActivo', array('local' => 'iddocusufructo', 'foreign' => 'iddocumentoactivo'));
    }

}
