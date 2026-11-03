<?php

class NomPartida extends BaseNomPartida
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatPartidaEntidad', array('local' => 'idpartida', 'foreign' => 'idpartida'));
    }

}

