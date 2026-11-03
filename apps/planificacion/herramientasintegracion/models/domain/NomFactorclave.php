<?php

class NomFactorclave extends BaseNomFactorclave
{

    public function setUp()
    {
        parent :: setUp ();
        $this->hasMany ('DatFactor', array ('local' => 'idfactorclave', 'foreign' => 'idfactorclave'));
    }

    public function getByid($idfactorclave)
    {
        return Doctrine::getTable('NomFactorclave')->find($idfactorclave);
    }

    public function getFactoresClaves(){

        $_query = Doctrine_Query::create();
        $_query->from('NomFactorclave f')
        ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        return $_query->execute();
    }


}

