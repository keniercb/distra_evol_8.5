<?php

class DatTiporeclamoEntidad extends BaseDatTiporeclamoEntidad
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomTiporeclamo', array('local' => 'idtiporeclamo', 'foreign' => 'idtiporeclamo')
        );
    }

}


