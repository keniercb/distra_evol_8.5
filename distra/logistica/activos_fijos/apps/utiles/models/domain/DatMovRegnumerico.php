<?php

/**
 *  Jorge Luis Cuellar Mondeja 28/10/2011
 */
class DatMovRegnumerico extends BaseDatMovRegnumerico
{

    /**
     *
     */
    public function setUp()
    {
        parent:: setUp();

        $this->hasOne('DatMovimientos', array('local' => 'idmovimiento', 'foreign' => 'idmovimiento'));
        $this->hasOne('DatRegnumerico', array('local' => 'idregnumerico', 'foreign' => 'idregnumerico'));
        $this->hasOne('DatMovRegnumericoActivo', array('local' => 'idmovregnumerico', 'foreign' => 'idmovregnumerico'));

        $relacion[] = array('cardinalidad' => 'many',
            'relation' => 'DatMovRegnumerico',
            'properties' => array('local' => 'idmovimiento',
                'foreign' => 'idmovimiento'));
        $movimiento = new DatMovimientos();
        LogisticaDoctrineHelper::__init()->tryInyectRelactions($movimiento, $relacion);
    }

}
