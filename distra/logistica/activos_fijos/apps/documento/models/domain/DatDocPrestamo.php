<?php

/**
 *
 */
class DatDocPrestamo extends BaseDatDocPrestamo
{

    /**
     *
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatDocumentoActivo', array('local' => 'iddocprestamo', 'foreign' => 'iddocumentoactivo'));
        $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
    }

}
