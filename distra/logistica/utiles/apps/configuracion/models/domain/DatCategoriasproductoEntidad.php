<?php

class DatCategoriasproductoEntidad extends BaseDatCategoriasproductoEntidad
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomCategoriasproducto',
            array('local' => 'idcategoria', 'foreign' => 'idcategoria')
        );
    }

}
