<?php

class DatSmstextContent extends BaseDatSmstextContent
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

