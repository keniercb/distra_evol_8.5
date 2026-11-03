<?php

/**
 *
 */
class DatAperturaRegNum extends BaseDatAperturaRegNum
{

    /**
     *
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatApertura', array('local' => 'iddocapertura', 'foreign' => 'iddocapertura'));



        $array[] = array('cardinalidad' => 'one',
                         'relation' => 'DatAperturaRegNum',
                         'properties' => array('local' => 'idregnumerico',
                                               'foreign' => 'idregnumerico'));
        $obj = new DatRegnumerico();
        LogisticaDoctrineHelper::__init()->tryInyectRelactions($obj, $array);


    }

}
