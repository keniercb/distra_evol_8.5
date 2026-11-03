<?php

class DatSistemaContent extends BaseDatSistemaContent
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatContenido',
            array('local' => 'idcontenido', 'foreign' => 'idcontenido')
        );
    }

}

