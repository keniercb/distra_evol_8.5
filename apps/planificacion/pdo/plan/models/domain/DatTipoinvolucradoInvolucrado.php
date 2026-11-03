<?php

class DatTipoinvolucradoInvolucrado extends BaseDatTipoinvolucradoInvolucrado
{

    public function setUp()
    {
        parent:: setUp();
    }

    public function getByid($llaveinvolucrado)
    {
        return Doctrine::getTable('DatTipoinvolucradoInvolucrado')->find(
            $llaveinvolucrado
        )->toArray();
    }


}

