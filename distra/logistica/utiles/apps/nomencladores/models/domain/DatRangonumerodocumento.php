<?php

class DatRangonumerodocumento extends BaseDatRangonumerodocumento
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatRangonumerocontrol',
            array(
            'local' => 'idrango',
            'foreign' => 'idrango'
            )
        );
    }

}
