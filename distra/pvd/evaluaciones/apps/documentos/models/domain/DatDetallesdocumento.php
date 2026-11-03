<?php

class DatDetallesdocumento extends BaseDatDetallesdocumento
{


    public function setUp()
    {
        parent :: setUp();
    }

    public function getById($iddetallesdocumento)
    {
        return Doctrine::getTable('DatDetallesdocumento')->find($iddetallesdocumento);
    }
    
}

