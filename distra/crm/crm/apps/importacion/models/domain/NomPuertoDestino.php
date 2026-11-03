<?php

class NomPuertoDestino extends BaseNomPuertoDestino
{

    public function setUp()
    {
        parent::setUp();
    }

    public function getPuertosDestino()
    {
        return Doctrine_Query::create()
            ->from('NomPuertoDestino')

            ->fetchArray();
    }
    public function getModelData($params)
    {
        return array();
    }
}
