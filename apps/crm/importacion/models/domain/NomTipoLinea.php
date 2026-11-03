<?php

class NomTipoLinea extends BaseNomTipoLinea
{

    public function setUp()
    {
        parent::setUp();
    }

    public function getSectores()
    {
        return Doctrine_Query::create()
            ->from('NomSector')
            ->fetchArray();
    }
}
