<?php

class DatIndicadorext extends BaseDatIndicadorext
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatIndicadorextcategoria',
            array('local' => 'idindicadorext', 'foreign' => 'idindicadorext')
        );
    }
}
