<?php
class DatMovtransferenciamunic extends BaseDatMovtransferenciamunic
{
    public function setUp()
    {
        $this->hasOne('DatMovimientos', array('foreign' => 'idmovimiento', 'local' => 'idmovimiento'));
        $this->hasOne('DatProductomunic', array('foreign' => 'idproductomunic', 'local' => 'idpartidaorigen'));

        $relations[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatMovtransferenciamunic',
            'properties' => array('local' => 'idmovimiento', 'foreign' => 'idmovimiento')
        );
        LogisticaDoctrineHelper::__init()->tryInyectRelactions(new DatMovimientos(), $relations);
    }

}