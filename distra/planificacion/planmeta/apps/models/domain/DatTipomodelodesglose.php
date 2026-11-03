<?php

class DatTipomodelodesglose extends BaseDatTipomodelodesglose
{

    public function setUp()
    {
        parent::setUp();   
         $this->hasOne(
            'DatDesglose',
            array('local' => 'iddesglose', 'foreign' => 'iddesglose')
        );
          $this->hasOne(
            'NomTipomodelo',
            array('local' => 'idtipomodelo', 'foreign' => 'idtipomodelo')
        );
    }

   

}