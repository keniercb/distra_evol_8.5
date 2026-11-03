<?php

/**
 *
 */
class DatPersonaInventario extends BaseDatPersonaInventario
{

    /**
     *
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasMany(
            'DatDocumentoActivo', array('local' => 'iddocinventarioparcial', 'foreign' => 'iddocumentoactivo')
        );
    }

}
