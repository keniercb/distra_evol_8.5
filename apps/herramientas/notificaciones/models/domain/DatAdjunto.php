<?php

class DatAdjunto extends BaseDatAdjunto
{

    public function setUp()
    {
        parent::setUp();

        $this->hasOne(
            'DatEmailContent',
            array('local' => 'fkemail', 'foreign' => 'idcontenido')
        );
    }

}