<?php

class NomNorma extends BaseNomNorma
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatNormaEntidad', array('local' => 'idnorma', 'foreign' => 'idnorma'));
    }

}
