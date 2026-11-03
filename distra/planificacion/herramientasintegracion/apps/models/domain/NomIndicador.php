<?php

class NomIndicador extends BaseNomIndicador
{

    public function setUp()
    {
        parent :: setUp ();
    }

    public function getByid($idindicador)
    {
        return Doctrine::getTable('NomIndicador')->find($idindicador)->toArray();
    }


}

