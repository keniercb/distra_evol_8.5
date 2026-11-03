<?php

class NomEmbalaje extends BaseNomEmbalaje
{

    public function setUp()
    {
        parent::setUp();
    }

    public function getEmbalajes()
    {
        return Doctrine_Query::create()
            ->from('NomEmbalaje')
            ->fetchArray();
    }
}
