<?php

/**
 * Created by PhpStorm.
 * User: yoendy
 * Date: 3/24/2016
 * Time: 4:27 PM
 */
class CfgIdentificadorMedio extends BaseCfgIdentificadorMedio
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomIndicador', array('local' => 'idindicador', 'foreign' => 'idindicador'));
        $doctrineHelper = LogisticaDoctrineHelper::__init();
        $relationsInd[] = array('cardinalidad' => 'one', 'relation' => 'CfgIdentificadorMedio',
                                'properties'   => array('local' => 'idindicador', 'foreign' => 'idindicador'));

        $doctrineHelper->tryInyectRelactions(new NomIndicador, $relationsInd);
    }
} 