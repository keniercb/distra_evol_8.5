<?php

class NomClienteFinal extends BaseNomClienteFinal
{

    public function setUp()
    {
        parent::setUp();
    }

    public function getClientesFinales()
    {
        return Doctrine_Query::create()
            ->from('NomClienteFinal')

            ->fetchArray();
    }
    public function getModelData($params)
    {
        return array();
    }
}
