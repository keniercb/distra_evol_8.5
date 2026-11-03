<?php

class DatEmailContent extends BaseDatEmailContent
{
    public function setUp()
    {
        parent::setUp();

        $this->hasOne(
            'DatContenido',
            array('local' => 'idcontenido', 'foreign' => 'idcontenido')
        );
        $this->HasMany(
            'DatAdjunto',
            array('local' => 'idcontenido', 'foreign' => 'fkemail')
        );
    }

}