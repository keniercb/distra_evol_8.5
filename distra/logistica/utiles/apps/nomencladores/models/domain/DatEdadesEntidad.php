<?php

class DatEdadesEntidad extends BaseDatEdadesEntidad
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomEdades', array('local' => 'idnomedades', 'foreign' => 'idnomedades'));

    }


}



