<?php

class DatNumerodocinicial extends BaseDatNumerodocinicial
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatSerieDocumentoEntidad',
            array(
            'local' => 'idseriedocentidad',
            'foreign' => 'idseriedocentidad'
            )
        );
    }

}
