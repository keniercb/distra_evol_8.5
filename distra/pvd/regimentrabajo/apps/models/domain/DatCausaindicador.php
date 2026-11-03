<?php

class DatCausaindicador extends BaseDatCausaindicador
{

    public function setUp()
    {
        parent :: setUp ();
    }

    public function getByid($idrotacion)
    {
        return Doctrine::getTable('DatCausaindicador')->find($idrotacion);
    }




}

