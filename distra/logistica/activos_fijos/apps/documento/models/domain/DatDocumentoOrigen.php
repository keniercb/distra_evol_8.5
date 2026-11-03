<?php

/**
 *
 */
class DatDocumentoOrigen extends BaseDatDocumentoOrigen
{

    /**
     *
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatDocumentoActivo', array('local' => 'iddocorigen', 'foreign' => 'iddocumentoactivo'));
        $this->hasOne('DatDocumento', array('local' => 'iddocorigen', 'foreign' => 'iddocumento'));
    }

}
