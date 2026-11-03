<?php

/**
 *
 */
class DatRegAutorizo extends BaseDatRegAutorizo
{

    /**
     *
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatDocumentoCliente', array('local' => 'iddocumentocliente', 'foreign' => 'iddocumentocliente'));
        
        
        $array[] = array('cardinalidad' => 'one',
            'relation' => 'DatRegAutorizo',
            'properties' => array('local' => 'idregnumerico',
                'foreign' => 'idregnumerico'));

        $numeroRegistro = new DatRegnumerico();

        LogisticaDoctrineHelper::__init()->tryInyectRelactions($numeroRegistro, $array);
    }

}
