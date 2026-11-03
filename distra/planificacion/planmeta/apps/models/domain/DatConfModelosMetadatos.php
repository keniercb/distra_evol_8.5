<?php

class DatConfModelosMetadatos extends BaseDatConfModelosMetadatos
{

    public function setUp()
    {
        parent:: setUp();
        $this->hasOne(
            'NomTipomodelo',
            array('local'   => 'idmodelosmetadatos',
                      'foreign' => 'idmodelosmetadatos')
        );
    }

}

