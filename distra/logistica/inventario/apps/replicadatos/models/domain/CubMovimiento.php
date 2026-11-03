<?php

class CubMovimiento extends BaseCubMovimiento
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DimEstructura', array('local' => 'idestructura', 'foreign' => 'idestructura'));
        $this->hasMany('DimProducto', array('local' => 'idproducto', 'foreign' => 'idproducto'));
        $this->hasMany('DimCategoria', array('local' => 'idcategoria', 'foreign' => 'idcategoria'));
        $this->hasMany('DimOperacion', array('local' => 'idoperacion', 'foreign' => 'idoperacion'));
        $this->hasMany('DimTiempo', array('local' => 'idtiempo', 'foreign' => 'idtiempo'));
        $this->hasMany('DimDocumento', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
        
    }

}
