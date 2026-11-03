<?php

class DatAtributosIndicador extends BaseDatAtributosIndicador
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'NomIndicador', array('local' => 'idindicador', 'foreign' => 'idindicador')
        );
    }
}

