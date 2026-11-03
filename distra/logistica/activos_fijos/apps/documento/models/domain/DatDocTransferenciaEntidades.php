<?php

/**
 *
 */
class DatDocTransferenciaEntidades extends BaseDatDocTransfEntreEntidades
{

    /**
     *
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatDocumentoActivo', array('local' => 'iddoctranfentidades', 'foreign' => 'iddocumentoactivo'));

        $array[] = array('cardinalidad' => 'one',
            'relation' => 'DatDocTransferenciaEntidades',
            'properties' => array('local' => 'iddocumento',
                'foreign' => 'iddoctranfentidades'));
        $obj = new DatDocumento();
        LogisticaDoctrineHelper::__init()->tryInyectRelactions($obj, $array);
    }

}
