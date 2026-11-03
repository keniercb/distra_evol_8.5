<?php

class DatMovdiferencia extends BaseDatMovdiferencia
{
    public function setUp()
    {
        $this->hasOne('DatMovimientos', array('local' => 'idmovimiento', 'foreign' => 'idmovimiento'));
        parent::setUp();
    }

}
