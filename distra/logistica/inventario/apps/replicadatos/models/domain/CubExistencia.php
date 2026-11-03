<?php

class CubExistencia extends BaseCubExistencia
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DimEstructura', array('local' => 'idestructura', 'foreign' => 'idestructura'));
        $this->hasMany('DimProducto', array('local' => 'idproducto', 'foreign' => 'idproducto'));
        $this->hasMany('DimCategoria', array('local' => 'idcategoria', 'foreign' => 'idcategoria'));
    }

}
