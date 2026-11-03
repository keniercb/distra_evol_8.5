<?php

class NomFabrica extends BaseNomFabrica
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatFabricaEntidad', array('local' => 'idfabrica', 'foreign' => 'idfabrica'));
    }

}

