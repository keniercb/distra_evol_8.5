<?php

class DatFabricaEntidad extends BaseDatFabricaEntidad
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomFabrica', array('local' => 'idfabrica', 'foreign' => 'idfabrica'));
    }

}


