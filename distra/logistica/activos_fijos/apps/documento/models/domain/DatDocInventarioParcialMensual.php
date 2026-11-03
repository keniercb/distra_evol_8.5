<?php

/**
 *
 */
class DatDocInventarioParcialMensual extends BaseDatDocInventarioParcialMensual
{

    /**
     *
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatDocumentoActivo', array('local' => 'iddocumentoactivo', 'foreign' => 'iddocumentoactivo'));
    }

}
