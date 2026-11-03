<?php

class DatMovubicacionbulto extends BaseDatMovubicacionbulto
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatMovubicacion', array('local' => 'idmovubicacion', 'foreign' => 'idmovubicacion')
        );
    }

}




