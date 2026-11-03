<?php

/**
 *
 */
class DatDocEnviadoReparar extends BaseDatDocEnviadoReparar
{

    /**
     *
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatDocumentoActivo', array('local' => 'iddocenviadoreparar', 'foreign' => 'iddocumentoactivo'));
        $this->hasOne('DatPersona', array('local' => 'idtransportador', 'foreign' => 'idpersona'));
    }

}
