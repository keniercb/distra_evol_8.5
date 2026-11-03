<?php

class DimOperacion extends BaseDimOperacion
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('CubMovimiento', array('local' => 'idoperacion', 'foreign' => 'idoperacion'));
    }

}


