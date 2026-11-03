<?php

/**
 *    Jorge Luis Cuellar Mondeja 24/04/2014
 * */
class DatProductoModulo extends BaseDatProductoModulo
{

    public function setUp()
    {
        parent:: setUp();

        $this->hasOne(
            'DatProductoLogistica', array('local' => 'idproducto', 'foreign' => 'idproducto')
        );

        $array[] = array('cardinalidad' => 'one',
            'relation' => 'DatProductoModulo',
            'properties' => array('local' => 'idproducto',
                'foreign' => 'idproducto'));

        $obj = new DatProductoLogistica();
        LogisticaDoctrineHelper::__init()->tryInyectRelactions($obj, $array);
    }

}
