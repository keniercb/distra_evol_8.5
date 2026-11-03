<?php

class DatMovnroserie extends BaseDatMovnroserie
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatNroserie', array('local' => 'idnroserie', 'foreign' => 'idnroserie'));
        $this->hasOne('DatMovimientos', array('local' => 'idmovimiento', 'foreign' => 'idmovimiento'));
        $relations[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatMovnroserie',
            'properties' => array('local' => 'idmovimiento', 'foreign' => 'idmovimiento')
        );
        LogisticaDoctrineHelper::__init()->tryInyectRelactions(new DatMovimientos(), $relations);
    }

}



