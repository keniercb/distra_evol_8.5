<?php

class DatDesglosemonedafactura extends BaseDatDesglosemonedafactura
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatMovimientos', array('local' => 'idmovimiento', 'foreign' => 'idmovimiento')
        );
        $array[] = array('cardinalidad' => 'many', 'relation' => 'DatDesglosemonedafactura',
            'properties' => array('local' => 'idmovimiento', 'foreign' => 'idmovimiento'));
        UtilesDoctrineModel::tryInyectRelactions(new DatMovimientos(), $array);
    }
}
