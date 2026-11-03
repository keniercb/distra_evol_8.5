<?php

class DatCategoriaprecioEntidad extends BaseDatCategoriaprecioentidad
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'NomCategoriaprecio',
            array('local'   => 'idcategoriaprecio',
                  'foreign' => 'idcategoriaprecio')
        );
    }
}