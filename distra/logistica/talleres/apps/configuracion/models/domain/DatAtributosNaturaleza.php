<?php

class DatAtributosNaturaleza extends BaseDatAtributosNaturaleza
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomIndicador', array('local' => 'idindicador', 'foreign' => 'idindicador')
        );

    }

}

