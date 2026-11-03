<?php

class DimDocumento extends BaseDimDocumento
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('CubMovimiento', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
    }

}
