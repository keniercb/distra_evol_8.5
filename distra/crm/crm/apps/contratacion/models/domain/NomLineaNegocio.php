<?php

class NomLineaNegocio extends BaseNomLineaNegocio
{

    public function setUp()
    {
        parent::setUp();
    }

    public function getLineasNegocio()
    {
        return Doctrine_Query::create()
            ->from('NomLineaNegocio')
            ->fetchArray();
    }
}
