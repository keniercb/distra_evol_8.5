<?php

class DatMovrecepcionreserva extends BaseDatMovrecepcionreserva
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatMovimientos', array('local' => 'idmovimiento', 'foreign' => 'idmovimiento'));
    }

}
