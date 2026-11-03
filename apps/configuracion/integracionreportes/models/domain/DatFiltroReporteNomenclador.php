<?php

class DatFiltroReporteNomenclador extends BaseDatFiltroReporteNomenclador
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
