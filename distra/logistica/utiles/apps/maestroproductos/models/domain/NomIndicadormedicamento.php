<?php

class NomIndicadormedicamento extends BaseNomIndicadormedicamento
{

    public function setUp()
    {
        parent::setUp();        
        $this->hasOne('NomIndicador',array('local' => 'idindicador', 'foreign' => 'idindicador'));
        $this->hasOne('NomTipoenvase',array('local' => 'idpresentacion', 'foreign' => 'idtipoenvase'));
    }

}
