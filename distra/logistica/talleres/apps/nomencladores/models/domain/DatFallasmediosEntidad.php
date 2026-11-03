<?php

class DatFallasmediosEntidad extends BaseDatFallasmediosEntidad
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomFallasmedios', array('local' => 'idfalla', 'foreign' => 'idfalla'));

    }


}



