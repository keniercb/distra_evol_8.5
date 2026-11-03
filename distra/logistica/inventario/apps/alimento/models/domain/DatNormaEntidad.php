<?php

class DatNormaEntidad extends BaseDatNormaEntidad
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomNorma', array('local' => 'idnorma', 'foreign' => 'idnorma'));
    }

}
