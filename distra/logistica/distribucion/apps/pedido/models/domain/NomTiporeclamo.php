<?php

class NomTiporeclamo extends BaseNomTiporeclamo
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatTiporeclamoEntidad', array('local' => 'idtiporeclamo', 'foreign' => 'idtiporeclamo')
        );
        $this->hasMany(
            'DatReclamopedido', array('local' => 'idtiporeclamo', 'foreign' => 'idtiporeclamoentidad')
        );
    }
}


