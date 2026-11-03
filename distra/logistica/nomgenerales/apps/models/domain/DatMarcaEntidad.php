<?php

class DatMarcaEntidad extends BaseDatMarcaEntidad
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('NomMarca', array('local' => 'idmarca', 'foreign' => 'idmarca'));
    }
}