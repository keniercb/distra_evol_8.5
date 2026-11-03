<?php

class DatMovlote extends BaseDatMovlote
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatLote', array('local' => 'idlote', 'foreign' => 'idlote'));
        $this->hasOne('DatMovimientos', array('local' => 'idmovimiento', 'foreign' => 'idmovimiento'));
        $this->hasOne('DatMovubicacion', array('local' => 'idmovimiento', 'foreign' => 'idmovimiento'));
        $this->hasOne('DatEstructuraubicacion', array('local' => 'idubicacion', 'foreign' => 'idestructuraubicacion'));
        $relations[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatMovlote',
            'properties' => array('local' => 'idmovimiento', 'foreign' => 'idmovimiento')
        );
        LogisticaDoctrineHelper::__init()->tryInyectRelactions(new DatMovimientos(), $relations);
    }

}
