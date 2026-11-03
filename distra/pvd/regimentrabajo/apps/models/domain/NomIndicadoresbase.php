<?php

class NomIndicadoresbase extends BaseNomIndicadoresbase
{

    public function setUp()
    {
        parent :: setUp ();
    }

    public function getByid($idrotacion)
    {
        return Doctrine::getTable('NomIndicadoresbase')->find($idrotacion);
    }



}

