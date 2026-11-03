<?php

class DatMovubicacionproducto extends BaseDatMovubicacionproducto
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatMovubicacion', array('local' => 'idmovubicacion', 'foreign' => 'idmovubicacion')
        );
        $this->hasOne(
            'DatMovimientos', array('local' => 'idmovimiento', 'foreign' => 'idmovimiento')
        );
    }

}


