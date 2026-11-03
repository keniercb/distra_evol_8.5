<?php

class DatConservacionEntidad extends BaseDatConservacionEntidad
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomConservacion', array('local' => 'idconservacion', 'foreign' => 'idconservacion'));
    }

}


