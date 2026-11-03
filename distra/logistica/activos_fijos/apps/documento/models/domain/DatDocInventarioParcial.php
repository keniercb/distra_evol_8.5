<?php

/**
 *
 */
class DatDocInventarioParcial extends BaseDatDocInventarioParcial
{

    /**
     *
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne(
            'DatDocumentoActivo', array('local' => 'iddocinventarioparcial', 'foreign' => 'iddocumentoactivo')
        );
    }

}
