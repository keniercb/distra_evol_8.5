<?php

class DatElementocategoria extends BaseDatElementocategoria
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatMovimientos', array('local' => 'idmovimiento', 'foreign' => 'idmovimiento')
        );
        $this->hasOne(
            'DatElementosFactura', array('local' => 'idelementofactura', 'foreign' => 'idelementofactura')
        );
        $this->hasOne(
            'DatCuentadesgloceprecio',
            array('local' => 'idcuentadesgloseprecio', 'foreign' => 'idcuentadesgloseprecio')
        );
        $array[] = array('cardinalidad' => 'many', 'relation' => 'DatElementocategoria',
            'properties' => array('local' => 'idmovimiento', 'foreign' => 'idmovimiento'));
        UtilesDoctrineModel::tryInyectRelactions(new DatMovimientos(), $array);
    }
}
