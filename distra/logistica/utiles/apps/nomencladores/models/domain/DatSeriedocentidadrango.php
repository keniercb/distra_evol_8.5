<?php

class DatSeriedocentidadrango extends BaseDatSeriedocentidadrango
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
        $this->hasOne(
            'DatRangonumerocontrol',
            array(
            'local' => 'idrango',
            'foreign' => 'idrango'
            )
        );
    }

}
