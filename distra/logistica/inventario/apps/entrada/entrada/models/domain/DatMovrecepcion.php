<?php

class DatMovrecepcion extends BaseDatMovrecepcion
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatMovimientos', array('local' => 'idmovimiento', 'foreign' => 'idmovimiento'));
    }

}
