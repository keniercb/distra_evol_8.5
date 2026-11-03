<?php

class NomTipoPrograma extends BaseNomTipoPrograma
{

    public function setUp()
    {
        parent::setUp();
    }

    public function getTipoPrograma()
    {
        return Doctrine_Query::create()
            ->from('NomTipoPrograma')
            ->fetchArray();
    }
}
