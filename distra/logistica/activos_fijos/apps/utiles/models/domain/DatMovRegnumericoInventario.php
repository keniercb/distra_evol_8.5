<?php

/**
 *
 */
class DatMovRegnumericoInventario extends BaseDatMovRegnumericoInventario
{

    /**
     *
     */
    public function setUp()
    {
        parent:: setUp();

        $this->hasOne('DatMovRegnumericoActivo', array('local' => 'idmovregnumerico', 'foreign' => 'idmovregnumerico'));

        $array[] = array('cardinalidad' => 'one',
            'relation' => 'DatMovRegnumericoInventario',
            'properties' => array('local' => 'idmovregnumerico',
                'foreign' => 'idmovregnumerico'));

        $obj = new DatMovRegnumerico();
        LogisticaDoctrineHelper::__init()->tryInyectRelactions($obj, $array);
    }

}
