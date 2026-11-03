<?php

class DatCalidadmovdiferenciaEntidad extends BaseDatCalidadmovdiferenciaEntidad
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomCalidadmovdiferencia',
            array('local' => 'idcalidad', 'foreign' => 'idcalidad')
        );
    }

}

//fin clase 
