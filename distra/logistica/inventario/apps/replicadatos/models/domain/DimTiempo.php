<?php

class DimTiempo extends BaseDimTiempo
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('CubMovimiento', array('local' => 'idtiempo', 'foreign' => 'idtiempo'));
    }

}



