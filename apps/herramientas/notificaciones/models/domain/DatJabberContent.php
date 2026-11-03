<?php

class DatJabberContent extends BaseDatJabberContent
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

