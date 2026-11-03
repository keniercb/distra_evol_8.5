<?php

class NomComparacion extends BaseNomComparacion
{

    public function setUp()
    {
        parent:: setUp();
    }

    public function getByid($menor)
    {
        return Doctrine::getTable('NomComparacion')->find($menor)->toArray();
    }


}

