<?php

class NomTipoinvolucrado extends BaseNomTipoinvolucrado
{

    public function setUp()
    {
        parent:: setUp();
    }

    public function getByid($incidencia)
    {
        return Doctrine::getTable('NomTipoinvolucrado')->find($incidencia)
            ->toArray();
    }


}

