<?php

class DatPosEntidad extends BaseDatPosentidad
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomPos', array('local' => 'idpos', 'foreign' => 'idpos'));
    }
}
