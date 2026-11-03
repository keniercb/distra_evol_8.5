<?php

class DatMovproductomunic extends BaseDatMovproductomunic
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatProductomunic', array('local' => 'idproductomunic', 'foreign' => 'idproductomunic'));
        $this->hasOne('DatMovimientos', array('local' => 'idmovimiento', 'foreign' => 'idmovimiento'));
        $relations[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatMovproductomunic',
            'properties' => array('local' => 'idmovimiento', 'foreign' => 'idmovimiento')
        );
        LogisticaDoctrineHelper::__init()->tryInyectRelactions(new DatMovimientos(), $relations);
    }

}


