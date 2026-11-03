<?php

/**
 * @author
 * @version
 * @copyright
 */
class DatRelacion extends BaseDatRelacion
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomTipoConcepto',
            array('local' => 'idtipoconceptopadre', 'foreign' => 'idtipoconcepto')
        );
		 $this->hasOne(
            'NomTipoConcepto',
            array('local' => 'idtipoconceptohijo', 'foreign' => 'idtipoconcepto')
        );
        
    }

}

//fin clase 



