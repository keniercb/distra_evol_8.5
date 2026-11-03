<?php

class DatPartidaEntidad extends BaseDatPartidaEntidad
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomPartida', array('local' => 'idpartida', 'foreign' => 'idpartida'));
    }

}


