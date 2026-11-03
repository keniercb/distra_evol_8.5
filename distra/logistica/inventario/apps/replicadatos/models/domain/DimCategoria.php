<?php

class DimCategoria extends BaseDimCategoria
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('CubExistencia', array('local' => 'idcategoria', 'foreign' => 'idcategoria'));
        $this->hasOne('CubMovimiento', array('local' => 'idcategoria', 'foreign' => 'idcategoria'));
    }

}


