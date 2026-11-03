<?php

class DatEstructuraNomenclador extends BaseDatEstructuraNomenclador
{

    public function setUp()
    {
        parent:: setUp();
    }

    public function getByid($idnomenclador)
    {
        return Doctrine::getTable('DatEstructuraNomenclador')->find(
            $idnomenclador
        )->toArray();
    }


}

