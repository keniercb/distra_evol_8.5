<?php

class NomDestinoComercial extends BaseNomDestinoComercial
{

    public function setUp()
    {
        parent::setUp();
    }

    public function getDestinoComercial()
    {
        return Doctrine_Query::create()
            ->from('NomDestinoComercial')

            ->fetchArray();
    }
    public function getModelData($params)
    {
        return array();
    }
}
