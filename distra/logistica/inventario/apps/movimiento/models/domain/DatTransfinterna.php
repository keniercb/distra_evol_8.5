<?php

class DatTransfinterna extends BaseDatTransfinterna
{
    public function setUp()
    {
        $this->hasOne(
            'DatDocumento', array(
                'foreign' => 'iddocumento', 'local' => 'idinventario'
            )
        );
        parent::setUp();
    }

}