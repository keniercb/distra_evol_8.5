<?php

class DatPlanificacioncuenta extends BaseDatAjusteplanificacion
{

    public function setUp()
    {
        parent::setUp();

        $this->hasOne(
            'DatPlanificacion',
            array('local' => 'idplanificacion', 'foreign' => 'idplanificacion')
        );
       
    }

}
