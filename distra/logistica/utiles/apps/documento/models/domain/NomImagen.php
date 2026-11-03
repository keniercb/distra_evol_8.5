<?php

class NomImagen extends BaseNomImagen
{

    public function setUp()
    {
        $this->hasOne(
            'DatDocumentoImagen', array('local' => 'idimagen', 'foreign' => 'idimagen')
        );
        parent::setUp();
    }


}
