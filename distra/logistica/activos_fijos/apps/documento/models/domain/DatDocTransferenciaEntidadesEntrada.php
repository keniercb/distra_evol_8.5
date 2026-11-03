<?php

/**
 *
 */
class DatDocTransferenciaEntidadesEntrada extends BaseDatDocTransfEntreEntidadesEntrada
{

    /**
     *
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatDocumentoActivo', array('local' => 'iddoctranfentidades', 'foreign' => 'iddocumentoactivo'));

        $array[] = array('cardinalidad' => 'one',
            'relation' => 'DatDocTransferenciaEntidadesEntrada',
            'properties' => array('local' => 'iddocumento',
                'foreign' => 'iddoctranfentidadesentrada'));
        $obj = new DatDocumento();
        LogisticaDoctrineHelper::__init()->tryInyectRelactions($obj, $array);
    }

}
