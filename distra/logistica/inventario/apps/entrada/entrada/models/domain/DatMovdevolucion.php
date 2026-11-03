<?php

class DatMovdevolucion extends BaseDatMovdevolucion
{
    public function setUp()
    {
        $this->hasOne('DatMovimientos', array('local' => 'idmovimiento', 'foreign' => 'idmovimiento'));
        parent::setUp();
    }

}
