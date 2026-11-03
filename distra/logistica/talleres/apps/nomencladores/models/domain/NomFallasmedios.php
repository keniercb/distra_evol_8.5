<?php

class NomFallasmedios extends BaseNomFallasmedios
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatFallasmediosEntidad', array('local' => 'idfalla', 'foreign' => 'idfalla')
        );

    }

}




