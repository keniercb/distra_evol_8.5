<?php

class NomSector extends BaseNomSector
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
