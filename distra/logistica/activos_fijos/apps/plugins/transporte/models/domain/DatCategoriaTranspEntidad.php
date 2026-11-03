<?php

/**
 *
 */
class DatCategoriaTranspEntidad extends BaseDatCategoriaTranspEntidad
{

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('NomCategoriaTransp', array('local' => 'idcategoria', 'foreign' => 'idcategoriaentidad'));
    }

}
