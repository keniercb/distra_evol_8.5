<?php

class DatFiltroReporteNumerico extends BaseDatFiltroReporteNumerico
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatFiltroReporte',
            array('local' => 'idfiltro', 'foreign' => 'idfiltro')
        );
    }


}

//fin clase 
