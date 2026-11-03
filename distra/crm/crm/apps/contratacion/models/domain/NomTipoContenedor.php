<?php

class NomTipoContenedor extends BaseNomTipoContenedor
{

    public function setUp()
    {
        parent::setUp();
    }

    public function getTiposContenedores()
    {
        return Doctrine_Query::create()
            ->from('NomTipoContenedor')
            ->fetchArray();
    }
}
