<?php

class DatViaadquisicionEntidad extends BaseDatViaadquisicionEntidad
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('NomViaadquisicion', array('local' => 'idviaadquisicion', 'foreign' => 'idviaadquisicion'));
    }
}