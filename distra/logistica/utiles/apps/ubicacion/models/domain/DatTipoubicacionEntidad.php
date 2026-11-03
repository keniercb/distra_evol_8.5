<?php

class DatTipoubicacionEntidad extends BaseDatTipoubicacionEntidad
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomTipoubicacion', array('local' => 'idtipoubicacion', 'foreign' => 'idtipoubicacion')
        );
    }

}


