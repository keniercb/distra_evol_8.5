<?php

class DatFiltroReporteEstructura extends BaseDatFiltroReporteEstructura
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
