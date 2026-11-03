<?php

class DatReclamopedido extends BaseDatReclamopedido
{

    public function setUp()
    {
        $this->hasOne(
            'DatPedido', array('local' => 'idpedido', 'foreign' => 'iddocumento')
        );
        $this->hasOne(
            'NomTiporeclamo', array('local' => 'idtiporeclamoentidad', 'foreign' => 'idtiporeclamo')
        );
        parent::setUp();
    }
}


