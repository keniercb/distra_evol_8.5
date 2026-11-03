<?php

/**
 * @author
 * @version
 * @copyright
 */
class NomTipoConcepto extends BaseNomTipoConcepto
{

    public function setUp()
    {
        parent::setUp();
     
        $this->hasOne(
            'NomModulo',array('local' => 'idmodulo', 'foreign' => 'idmodulo')
        );
		  $this->hasMany(
            'NomTipoConcepto',
            array('local' => 'idtipoconcepto', 'foreign' => 'idtipoconceptopadre')
        );
		 $this->hasMany(
            'NomTipoConcepto',
            array('local' => 'idtipoconcepto', 'foreign' => 'idtipoconceptopadre')
        );
      
    }

}

//fin clase 



