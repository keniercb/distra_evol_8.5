<?php

class DatTransicionConfEstructura extends BaseDatTransicionConfEstructura
{

    public function setUp()
    {
        parent:: setUp();
    }

    public function getByid($simultaneo)
    {
        return Doctrine::getTable('DatTransicionConfEstructura')->find(
            $simultaneo
        )->toArray();
    }


}

