<?php

class NomCalidadmovdiferencia extends BaseNomCalidadmovdiferencia
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatCalidadmovdiferenciaEntidad',
            array('local' => 'idcalidad', 'foreign' => 'idcalidad')
        );

    }


}//fin clase


