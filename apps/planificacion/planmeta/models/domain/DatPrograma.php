<?php

class DatPrograma extends BaseDatPrograma
{

    public function setUp()
    {
        parent:: setUp();
    }

    public function getByid($idprograma)
    {
        return Doctrine::getTable('DatPrograma')->find($idprograma)->toArray();
    }

}

