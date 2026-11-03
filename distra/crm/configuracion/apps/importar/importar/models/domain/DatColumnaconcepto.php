<?php

class DatColumnaconcepto extends BaseDatColumnaconcepto
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatConfiguracionimportar',
            array('local' => 'idconfiguracion', 'foreign' => 'idconfiguracion')
        );
    }

}

//fin clase 
