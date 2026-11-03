<?php

class ConfEstructuraConfDocDatEstado extends BaseConfEstructuraConfDocDatEstado
{

    public function setUp()
    {
        parent:: setUp();
    }

    public function getByid($idtransicion)
    {
        return Doctrine::getTable('ConfEstructuraConfDocDatEstado')->find(
            $idtransicion
        )->toArray();
    }


}

